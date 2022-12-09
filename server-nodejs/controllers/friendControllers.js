const bcrypt = require("bcrypt");
const Conversation = require("../models/conversation");
// const conversationService = require("../services/conversationService");
// const messageService = require('../services/messageService');
const MyError = require("../exception/MyError");
const User = require("../models/user");
const conversationValidate = require("../validate/validateConversation");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Member = require("../models/member");
const Message = require("../models/message");
const FriendRequest = require("../models/friendRequest");
const conversationConller = require("../controllers/conversationControllers");
class FriendController {
  constructor(io) {
    this.io = io;
    this.acceptFriend = this.acceptFriend.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.sendFriendInvite = this.sendFriendInvite.bind(this);
    this.deleteFriendInvite = this.deleteFriendInvite.bind(this);
    this.deleteInviteWasSend = this.deleteInviteWasSend.bind(this);
  }

  // [GET] /?name
  async getListFriends(req, res, next) {
    const { user } = req;

    try {
      const friendIds = await User.getListFriendsByUserId(user.id);
      res.json(friendIds);
    } catch (err) {
      next(err);
    }
  }

  // [POST] /:userId
  async acceptFriend(req, res, next) {
    const { user } = req;
    const { senderId } = req.params;

    try {
      // check có lời mời này không
      await FriendRequest.checkByIds(senderId, user.id);
      // check đã là bạn bè
      if (await User.checkIsFriends(user.id, senderId))
        throw new MyError("Friend exists");

      // xóa đi lời mời
      await FriendRequest.deleteOne({ senderId, receiverId: user.id });

      // thêm bạn bè
      await User.updateOne({ _id: user.id }, { $push: { friends: senderId } });
      await User.updateOne({ _id: senderId }, { $push: { friends: user.id } });
      const sender = await User.findById(senderId).select("-password");
      const { _id, isExists } = await FriendRequest.createConversation(
        user.id,
        senderId
      );

      // tạo message
      const newMessage = new Message({
        content: "Đã là bạn bè",
        type: "NOTIFY",
        conversationId: _id,
        senderId: user.id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      await Conversation.updateOne(
        { _id: _id },
        { $push: { messages: saveMessage._id } }
      );
      //Update last message
      await Conversation.updateOne(
        { _id: _id },
        { lastMessageId: saveMessage._id }
      );
      const userId = user.id;
      await Member.updateOne(
        { conversationId: _id, userId },
        { $set: { lastView: new Date() } }
      );
      await Member.updateOne(
        { conversationId: _id, userId: senderId },
        { $set: { lastView: new Date() } }
      );

      this.io.to(senderId + "").emit("accept-friend", { user: sender });

      if (isExists) {
        console.log(`emit to ${_id} --- new-message`);
        this.io.to(_id + "").emit("new-message", { message: saveMessage });
      } else {
        console.log(
          `emit to ${senderId} --- create-individual-conversation-when-was-friend`
        );
        this.io
          .to(senderId + "")
          .emit("create-individual-conversation-when-was-friend", _id);
        this.io
          .to(user.id + "")
          .emit("create-individual-conversation-when-was-friend", _id);
      }
      res
        .status(201)
        .json({ conversationId: _id, isExists, message: saveMessage });
    } catch (err) {
      next(err);
    }
  }

  // // [DELETE] /:userId
  async deleteFriend(req, res, next) {
    const { user } = req;
    // const userId = req;
    const { userId } = req.params;
    try {
      if (!(await User.checkIsFriends(user.id, userId)))
        throw new MyError("User is not friend");
      await User.updateOne({ _id: user.id }, { $pull: { friends: userId } });
      await User.updateOne({ _id: userId }, { $pull: { friends: user.id } });
      console.log(`emit to ${userId} --- deleted-friend`);
      this.io.to(userId + "").emit("deleted-friend", user.id);
      this.io.to(user.id + "").emit("deleted-friend", userId);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // // [GET] /invites
  async getListFriendInvites(req, res, next) {
    const { user } = req;
    const _id = user.id;
    try {
      const listFriendsInvite = await FriendRequest.getListFriendsInvite(
        user.id
      );
      res.status(200).json(listFriendsInvite);
    } catch (err) {
      next(err);
    }
  }
  // // [GET] /invites/me
  async getListFriendInvitesWasSend(req, res, next) {
    const { user } = req;
    // const { _id } = req;
    try {
      const listFriendInvitesWasSend =
        await FriendRequest.getListInvitesWasSend(user.id);
      res.json(listFriendInvitesWasSend);
    } catch (err) {
      next(err);
    }
  }

  // //[DELETE]  /invites/:userId
  async deleteFriendInvite(req, res, next) {
    const { user } = req;
    const _id = user.id;
    const { userId } = req.params;

    try {
      await FriendRequest.deleteByIds(userId, user.id);
      console.log(`emit to ${userId} --- deleted-friend-invite`);
      this.io.to(userId + "").emit("deleted-friend-invite", user.id);

      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
  // //[DELETE] /invites/me/:userId
  async deleteInviteWasSend(req, res, next) {
    const { user } = req;
    const senderId = user.id;
    // const { _id } = req;
    const { userId } = req.params;

    try {
      await FriendRequest.deleteByIds(senderId, userId);
      console.log(`emit to ${userId} --- eleted-invite-was-send`);
      this.io.to(userId + "").emit("deleted-invite-was-send", senderId);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // // [POST] /invites/me/:userId
  async sendFriendInvite(req, res, next) {
    const { user } = req;
    const senderId = user.id;
    const { userId } = req.params;
    try {
      await User.getById(userId);
      // check có bạn bè hay chưa
      if (await User.checkIsFriends(senderId, userId))
        throw new MyError("Friend exists");

      // check không có lời mời nào
      if (
        (await FriendRequest.existsByIds(senderId, userId)) ||
        (await FriendRequest.existsByIds(userId, senderId))
      )
        throw new MyError("Invite exists");
      const friendRequest = new FriendRequest({
        senderId: senderId,
        receiverId: userId,
      });
      await friendRequest.save();

      console.log(`emit to ${userId} --- send-friend-invite`);
      this.io.to(userId + "").emit("send-friend-invite", { senderId });
      this.io.to(senderId + "").emit("send-friend-invite-by-me", { userId });

      res.status(201).json();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FriendController;
