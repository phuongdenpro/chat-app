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
const AwsS3Upload = require("../uploads/awsS3Upload");
class conversationController {
  constructor(io) {
    this.io = io;
    this.createGroupConversation = this.createGroupConversation.bind(this);
    this.createConversationSimple = this.createConversationSimple.bind(this);
    this.rename = this.rename.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
    this.deleteConversationByLeader =
      this.deleteConversationByLeader.bind(this);
    this.addManagersForConversation =
      this.addManagersForConversation.bind(this);
    this.deleteManagersForConversation =
      this.deleteManagersForConversation.bind(this);

    this.deleteAllMessage =
        this.deleteAllMessage.bind(this);

  }

  // [GET]/conversation
  async getList(req, res, next) {
    console.log(req.user);
    const { user } = req;

    let conversations = await Conversation.find({
      members: { $in: [user.id] },
    })
      .sort({ updatedAt: -1 })
      .populate("members")
      .populate({
        path: "messages",
        populate: {
          path: "senderId",
          model: "User",
        },
      })
      .populate({
        path: "lastMessageId",
        populate: {
          path: "senderId",
          model: "User",
        },
      });

    console.log(conversations);
    // const messages = await Message.getListByIdConversation(conversation._id);
    console.log(user.id);
    res.json(conversations);
    return conversations;
  }
  // [GET] /:id
  async getConversationSummary(req, res, next) {
    const { user } = req;
    const { id } = req.params;

    try {
      // const conversation = await Conversation.getById(id);
      const conversation = await Conversation.getByIdAndUserId(id, user.id);
      // const { type } = conversation;
      // if (!type) throw new MyError("Only conversation group");
      // const conversationSummary = await Conversation.find({ _id: id })
      //   .populate("members")
      //   .populate("leaderId").populate("messages");
      res.json(conversation);
    } catch (err) {
      next(err);
    }
  }

  async createConversationSimple(req, res, next) {
    const { user } = req;
    const { userId } = req.body;
    const { name1, name2, conversationId } =
      await conversationValidate.validateSimpleConversation(user.id, userId);
    console.log(conversationId);
    // res.status(200).json(conversationId);
    if (conversationId)
      return res.status(200).json({ _id: conversationId, isExists: true });
    console.log(name1);
    const newConversation = new Conversation({
      members: [user.id, userId],
      type: false,
    });
    const saveConversation = await (
      await newConversation.save()
    )

      .populate("members");
    // const saveConversation = await (await newConversation.save())
    //   .populate("members")
    //   .populate("messages");
    const { _id } = saveConversation;
    // tạo 2 member
    const member1 = new Member({
      conversationId: _id,
      userId: user.id,
      name: name1,
    });

    const member2 = new Member({
      conversationId: _id,
      userId: userId,
      name: name2,
    });

    // save
    member1.save().then();
    member2.save().then();
    console.log(`emit to ${userId} ---- create-simple-conversation --- `);
    this.io.to(userId + "").emit("create-simple-conversation", _id);
    return res.json(saveConversation);
  }

  // create new conversation
  async createGroupConversation(req, res, next) {
    const { user } = req;
    const { name = "", userIds = [] } = req.body;
    console.log(userIds);
    let userIds2 = userIds.filter((userIdEle) => userIdEle != user.id);
    if (userIds2.length <= 0) throw new MyError("userIds invalid");
    // kiểm tra user
    const userIdsTempt = [user.id, ...userIds2];
    await User.checkByIds(userIdsTempt);
    const newConversation = new Conversation({
      name,
      leaderId: user.id,
      members: [user.id, ...userIds2],
      type: true,
    });
    const saveConversation = await (
      await newConversation.save()

    ).populate("members");
    const { _id } = saveConversation;
    // tạo tin nhắn
    const newMessage = new Message({
      senderId: user.id,
      content: "Đã tạo nhóm",
      type: "NOTIFY",
      conversationId: _id,
    });
    const saveMessage = await newMessage.save();
    //add mess vao conversation
    await Conversation.updateOne(
      { _id: _id },
      { $push: { messages: saveMessage._id } }
    );
    // lưu danh sách user
    for (const userId of userIdsTempt) {
      const member = new Member({
        conversationId: _id,
        userId,
      });

      member.save().then();
    }
    const memberAddMessage = new Message({
      senderId: user.id,
      manipulatedUserIds: [...userIds2],
      content: "Đã thêm vào nhóm",
      type: "NOTIFY",
      conversationId: _id,
    });
    const saveMemberAddMessage = await memberAddMessage.save();

    await Conversation.updateOne(
      { _id },
      { lastMessageId: saveMemberAddMessage._id }
    ).then();

    await Conversation.updateOne(
      { _id: _id },
      { $push: { messages: saveMemberAddMessage._id } }
    );
    const userIdsTempt2 = [user.id, ...userIds];
    console.log(userIdsTempt2);
    userIdsTempt2.forEach((userIdEle) =>
      this.io.to(userIdEle).emit("create-group-conversation", _id)
    );
    res.status(201).json(saveConversation);
  }
  //   //[PATCH]  /:id/name
  async rename(req, res, next) {
    const { user } = req;
    const { id } = req.params;
    const userId = user.id;
    const { name } = req.body;

    try {
      if (!name) throw new MyError("Name invalid");
      const conversation = await Conversation.getByIdAndUserId(id, userId);
      console.log(conversation);
      const { type } = conversation;
      // group
      // if (type) {
      // thêm tin nhắn đổi tên
      const newMessage = new Message({
        senderId: userId,
        content: `Đã đổi tên nhóm thành "${name}" `,
        type: "NOTIFY",
        conversationId: id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      await Conversation.updateOne(
        { _id: id },
        { $push: { messages: saveMessage._id } }
      );
      // cập nhật tin nhắn mới nhất
      await Conversation.updateOne(
        { _id: id },
        { name, lastMessageId: saveMessage._id }
      );
      // cập nhật lastView thằng đổi
      await Member.updateOne(
        { conversationId: id, userId: userId },
        { lastView: saveMessage.createdAt }
      );
      this.io.to(id + "").emit("rename-conversation", id, name, saveMessage);
      this.io.to(id + "").emit("new-message", { message: saveMessage });
      // } else {
      //   // cá nhân
      //   const { members } = conversation;
      //   const otherUserId = members.filter((userIdEle) => userIdEle != userId);

      //   await Member.updateOne(
      //     { conversationId: id, userId: otherUserId[0] },
      //     { name }
      //   );
      // }
      // là group thì bắt sự kiện socket
      // if (saveMessage) {
      //   this.io.to(id + "").emit("rename-conversation", id, name, saveMessage);
      // }
      res.json();
    } catch (err) {
      next(err);
    }
  }
  //   //[PATCH] /:id/avatar
  async updateAvatar(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const file = req.file;
    const { id } = req.params;

    try {
      const { mimetype } = file;
      if (mimetype !== "image/jpeg" && mimetype !== "image/png")
        throw new MyError("Image invalid");
      const conversation = await Conversation.getByIdAndUserId(id, userId);
      const { type } = conversation;
      // if (!type) throw new MyError('Upload file fail, only for group');

      const { avatar } = conversation;
      if (avatar) await AwsS3Upload.deleteFile(avatar);
      const avatarUrl = await AwsS3Upload.uploadFile(file);
      // thêm tin nhắn đổi tên
      const newMessage = new Message({
        senderId: userId,
        content: `Ảnh đại diện nhóm đã thay đổi`,
        type: "NOTIFY",
        conversationId: id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      await Conversation.updateOne(
        { _id: id },
        { $push: { messages: saveMessage._id } }
      );
      // cập nhật conversation
      await Conversation.updateOne(
        { _id: id },
        { avatar: avatarUrl, lastMessageId: saveMessage._id }
      );
      // cập nhật lastView thằng đổi
      await Member.updateOne(
        { conversationId: id, userId },
        { lastView: saveMessage.createdAt }
      );

      this.io
        .to(id + "")
        .emit("update-avatar-conversation", id, avatarUrl, saveMessage);
      this.io.to(id + "").emit("new-message", { message: saveMessage });
      res.json({ avatarUrl, saveMessage });
    } catch (err) {
      next(err);
    }
  }

  //   // [DELETE] /:id
  async deleteConversationByLeader(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id } = req.params;

    try {
      const conversation = await Conversation.getByIdAndUserId(id, userId);
      // chỉ leader mới được xóa
      const { type, leaderId } = conversation;
      if (!type || leaderId != userId)
        throw new MyError("Not permission delete group");
      await Member.deleteMany({ conversationId: id });
      await Message.deleteMany({ conversationId: id });
      await Conversation.deleteOne({ _id: id });
      this.io.to(id).emit("delete-conversation", id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
  //   // [DELETE] /:id/messages
  async deleteAllMessage(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id } = req.params;

    try {
      await Member.getByConversationIdAndUserId(id, userId);
      Message.updateMany(
        { conversationId: id, deletedWithUserIds: { $nin: [userId] } },
        { $push: { deletedWithUserIds: userId } }
      ).then();
      this.io.to(id).emit("delete-all-message", id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  //   // [PATCH] /:id/notify/:isNotify
  async updateConversationNotify(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id, isNotify } = req.params;

    try {
      if (!isNotify || (isNotify != "0" && isNotify != "1"))
        throw new MyError("Value isNotify only 0 or 1");
      const member = await Member.getByConversationIdAndUserId(id, userId);
      member.isNotify = isNotify === 1 ? true : false;
      await member.save();
      res.json();
    } catch (err) {
      next(err);
    }
  }

  async getLastViewOfUserAllConversation(req, res, next) {
    const { user } = req;
    const userId = user.id;
    console.log(userId);

    try {
      const members = await Member.find({ userId: userId }).populate("userId");
      res.json(members);
    } catch (err) {
      next(err);
    }
  }

  //   // [GET] /:id/last-view
  async getLastViewOfMembers(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id } = req.params;

    try {
      await Member.getByConversationIdAndUserId(id, userId);
      const members = await Member.find({ conversationId: id }).populate(
        "userId"
      );
      res.json(members);
    } catch (err) {
      next(err);
    }
  }



  //   // [POST] /:id/managers
  async addManagersForConversation(req, res, next) {
    const { user } = req;
    // const { _id } = req.body;
    const userId = user.id;
    const { id } = req.params;
    const { managerId } = req.body;
    console.log(managerId);

    try {
      const conversation = await Conversation.getByIdAndUserId(id, userId);
      const { type, leaderId, managerIds } = conversation;
      if (!type || leaderId + "" !== userId)
        throw new MyError(
          "Add managers failed, not is leader or only conversation group"
        );
      await Conversation.existsByUserIds(id, managerId);
      let managerIdsTempt = [];
      // console.log(managerId);
      managerId.forEach((userIdEle) => {
        const index = managerIds.findIndex((ele) => ele + "" == userIdEle);

        if (index === -1 && userIdEle != userId)
          managerIdsTempt.push(userIdEle);
      });
      if (managerIdsTempt.length === 0)
        throw new MyError(
          "Add managers failed, not is leader or only conversation group"
        );
      console.log(managerIdsTempt);
      await Conversation.updateOne(
        { _id: id },
        { $set: { managerIds: [...managerIds, ...managerIdsTempt] } }
      );
      // tin nhắn thêm vào group
      const newMessage = new Message({
        senderId: userId,
        manipulatedUserIds: managerIdsTempt,
        content: "ADD_MANAGERS",
        type: "NOTIFY",
        conversationId: id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      await Conversation.updateOne(
        { _id: id },
        { $push: { messages: saveMessage._id } }
      );
      await Conversation.updateOne(
        { _id: id },
        { lastMessageId: saveMessage._id }
      );
      await Member.updateOne(
        { conversationId: id, userId },
        { $set: { lastView: new Date() } }
      );
      this.io.to(id + "").emit("add-managers", {
        conversationId: id,
        managerIds: managerId,
      });
      this.io.to(id + "").emit("new-message", { message: saveMessage });
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  }

  //   // [DELETE] /:id/managers
  async deleteManagersForConversation(req, res, next) {
    const { user } = req;
    // const { _id } = req.body;
    const userId = user.id;
    const { id } = req.params;
    const { managerId } = req.body;

    try {
      const conversation = await Conversation.getByIdAndUserId(id, userId);
      const { type, leaderId, managerIds } = conversation;
      if (!type || leaderId + "" !== userId)
        throw new MyError(
          "Delete managers failed, not is leader or only conversation group"
        );
      let managerIdsTempt = [...managerIds];
      const deleteManagerIdsTempt = [];
      managerId.forEach((userIdEle) => {
        const index = managerIdsTempt.findIndex((ele) => ele + "" == userIdEle);

        if (index !== -1 && userIdEle != userId) {
          managerIdsTempt.splice(index, 1);
          deleteManagerIdsTempt.push(userIdEle);
        }
      });
      if (deleteManagerIdsTempt.length === 0)
        throw new MyError(
          "Delete managers failed, not is leader or only conversation group"
        );

      await Conversation.updateOne(
        { _id: id },
        { $set: { managerIds: managerIdsTempt } }
      );
      // tin nhắn thêm vào group
      const newMessage = new Message({
        senderId: userId,
        manipulatedUserIds: deleteManagerIdsTempt,
        content: "DELETE_MANAGERS",
        type: "NOTIFY",
        conversationId: id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      await Conversation.updateOne(
        { _id: id },
        { $push: { messages: saveMessage._id } }
      );
      await Conversation.updateOne(
        { _id: id },
        { lastMessageId: saveMessage._id }
      );
      await Member.updateOne(
        { conversationId: id, userId },
        { $set: { lastView: new Date() } }
      );
      this.io.to(id + "").emit("delete-managers", {
        conversationId: id,
        managerIds: deleteManagerIdsTempt,
      });
      this.io.to(id + "").emit("new-message", { message: saveMessage });
      res.status(200).json({ isSuccess: true });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = conversationController;
