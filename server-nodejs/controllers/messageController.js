const bcrypt = require("bcrypt");
// const messageService = require("../services/messageService");
const MyError = require("../exception/MyError");
const ArgumentError = require("../exception/ArgumentError");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Member = require("../models/member");
const User = require("../models/user");
const messageUtils = require("../utils/messageUtils");
const commonUtils = require("../utils/commonUtils");
const messageValidate = require("../validate/validateMessage");
const AwsS3Upload = require("../uploads/awsS3Upload");

class MessageController {
  constructor(io) {
    this.io = io;

    this.addText = this.addText.bind(this);
    this.addFile = this.addFile.bind(this);
    this.reCallMessageById = this.reCallMessageById.bind(this);
    this.deleteOnlyMeById = this.deleteOnlyMeById.bind(this);
    this.addReaction = this.addReaction.bind(this);
    this.shareMessage = this.shareMessage.bind(this);
    this.addPinMessage = this.addPinMessage.bind(this);
    this.deletePinMessage = this.deletePinMessage.bind(this);
  }

  // [GET] /:messageId get message by id
  async getById(req, res, next) {
    const { user } = req;
    const { messageId } = req.params;
    // console.log("messageId", messageId)
    try {
      if (!messageId || !user.id) throw new ArgumentError();
      const message = await Message.getById(messageId);
      console.log(message);

      let userId = user.id;
      const conversationId = message.conversationId;
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: new Date() } }
      );
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /:conversationId get list mess of conversation
  async getList(req, res, next) {
    const { user } = req;
    const { conversationId } = req.params;

    try {
      if (!conversationId || !user.id) throw new ArgumentError();
      const conversation = await Conversation.getByIdAndUserId(
        conversationId,
        user.id
      );
      const messages = await Message.getListByIdConversation(conversation._id);
      console.log(messages);

      let userId = user.id;
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: new Date() } }
      );
      res.json({ messages });
    } catch (error) {
      next(error);
    }
  }

  // //[POST] /message/text Add text message
  async addText(req, res, next) {
    const { user } = req;
    const senderId = user.id;

    try {
      const { conversationId } = req.body;
      console.log(conversationId);
      const message = req.body;
      await messageValidate.validateTextMessage(message, senderId);
      const newMessage = new Message({
        conversationId,
        senderId,
        ...message,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      //add mess vao conversation
      await Conversation.updateOne(
        { _id: conversationId },
        { $push: { messages: saveMessage._id } }
      );
      const { _id } = saveMessage;
      //update lastmessage
      await Conversation.updateOne(
        { _id: conversationId },
        { lastMessageId: _id }
      );
      const userId = user.id;
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: new Date() } }
      );
      const { type } = await Conversation.findById(conversationId);
      this.io
        .to(conversationId + "")
        .emit("new-message", { message: saveMessage });

      res.status(201).json(saveMessage);
    } catch (err) {
      next(err);
    }
  }

  //[POST] /files  tin nhắn dạng file
  async addFile(req, res, next) {
    const { user } = req;
    const userId = user.id;
    // const file  = req.file;
    const file = req.file;
    const { type, conversationId } = req.params;
    console.log(file);
    console.log(type);

    try {
      if (!conversationId || !type)
        throw new MyError("Params type or conversationId not exists");
      await messageValidate.validateFileMessage(
        file,
        type,
        conversationId,
        userId
      );
      // upload ảnh
      const content = await AwsS3Upload.uploadFile(file);
      const newMessage = new Message({
        senderId: userId,
        conversationId,
        content,
        type,
      });
      // lưu xuống
      const saveMessage = await (await newMessage.save()).populate("senderId");
      //add mess vao conversation
      await Conversation.updateOne(
        { _id: conversationId },
        { $push: { messages: saveMessage._id } }
      );
      const { _id } = saveMessage;
      //update lastmessage
      await Conversation.updateOne(
        { _id: conversationId },
        { lastMessageId: _id }
      );
      // const userId = user.id;
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: new Date() } }
      );

      this.io
        .to(conversationId + "")
        .emit("new-message", { message: saveMessage });

      res.status(201).json(saveMessage);
    } catch (err) {
      next(err);
    }
  }

  // [DELETE] /:id thu hồi tin nhắn
  async reCallMessageById(req, res, next) {
    const { user } = req;
    console.log(user);
    const { id } = req.params;
    // const { conversationId } = req.body;
    try {
      const message = await Message.getById(id);
      const { senderId } = message;
      if (senderId._id != user.id)
        throw new MyError("Not permission delete message");
      await Message.updateOne({ _id: id }, { isDeleted: true });
      console.log("send message to ", message.conversationId + "");
      this.io
        .to(message.conversationId + "")
        .emit("delete-message", { message });
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // // [DELETE] /:id/only xóa ở phía tôi
  async deleteOnlyMeById(req, res, next) {
    const { id } = req.params;
    const { user } = req;
    const { conversationId } = req.body;
    try {
      const message = await Message.getById(id);
      const { deletedWithUserIds, isDeleted } = message;
      // tin nhắn đã thu hồi
      if (isDeleted) {
        res.status(200).json();
        return;
      }
      const index = deletedWithUserIds.findIndex(
        (userIdEle) => userIdEle == user.id
      );
      // tìm thấy, thì không thêm vô nữa
      if (index !== -1) {
        res.status(200).json();
        return;
      }
      await Message.updateOne(
        { _id: id },
        { $push: { deletedWithUserIds: user.id } }
      );
      // await messageService.deleteOnlyMeById(id, _id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // // [POST] /:id/reacts/:type
  async addReaction(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id, type } = req.params;

    try {
      const numberType = parseInt(type);
      if (numberType < 1 || numberType > 6)
        throw new MyError("Reaction type invalid");
      const message = await Message.getById(id);
      const { isDeleted, deletedWithUserIds, reacts, conversationId } = message;
      // nếu tin nhắn đã xóa
      if (isDeleted || deletedWithUserIds.includes(user.id))
        throw new MyError("Message was deleted");
      // tìm react thả bởi user
      const reactIndex = reacts.findIndex(
        (reactEle) => reactEle.userId == userId
      );
      const reactTempt = [...reacts];
      // không tìm thấy
      if (reactIndex === -1) {
        reactTempt.push({ userId, type });
      } else {
        reactTempt[reactIndex] = { userId, type };
      }
      await Message.updateOne(
        { _id: id },
        {
          $set: {
            reacts: reactTempt,
          },
        }
      );

      this.io.to(conversationId + "").emit("add-reaction", {
        conversationId,
        messageId: id,
        user,
        type,
      });
      res.status(201).json();
    } catch (err) {
      next(err);
    }
  }

  // // [POST] /:id/share/:conversationId
  async shareMessage(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id, conversationId } = req.params;

    try {
      const message = await Message.getById(id);
      const { content, type } = message;
      await Conversation.getByIdAndUserId(message.conversationId, userId);
      const conversationShare = await Conversation.getByIdAndUserId(
        conversationId,
        userId
      );
      if (type === "NOTIFY" || type === "VOTE")
        throw new MyError("Not share message type is NOTIFY or Vote");
      const newMessage = new Message({
        senderId: userId,
        content,
        type,
        conversationId,
      });
      // lưu xuống
      const saveMessage = await (await newMessage.save()).populate("senderId");

      const { _id, createdAt } = saveMessage;
      // update lại message mới nhất
      await Conversation.updateOne(
        { _id: conversationId },
        { lastMessageId: _id }
      );
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: createdAt } }
      );

      this.io
        .to(conversationId + "")
        .emit("new-message", { message: saveMessage });
      res.status(201).json(saveMessage);
    } catch (err) {
      next(err);
    }
  }
  // [GET] /:conversationId
  async getAllPinMessages(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { conversationId } = req.params;

    try {
      const conversation = await Conversation.getByIdAndUserId(
        conversationId,
        userId
      );
      const { type, pinMessageIds } = conversation;
      if (!type) throw new MyError("Only grop conversation");

      res.json(pinMessageIds);
    } catch (err) {
      next(err);
    }
  }
  // [POST] /:messageId
  async addPinMessage(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { messageId } = req.params;
    const messagePin = await Message.getById(messageId);
    // console.log(messagePin);

    try {
      const conversation = await messageValidate.validatePinMessage(
        messageId,
        userId
      );
      const { _id, type, pinMessageIds } = conversation;
      // console.log(pinMessageIds);
      const conversationId = _id;

      var found = false;
      for (var i = 0; i < pinMessageIds.length; i++) {
        if (pinMessageIds[i]._id == messageId) {
          found = true;
          break;
        }
      }
      if (!type || found || pinMessageIds.length >= 3)
        throw new MyError("Pin message only conversation, < 3 pin");
      await Conversation.updateOne(
        { _id: conversationId },
        { $push: { pinMessageIds: messageId } }
      );
      const newMessage = new Message({
        content: "Đã ghim một tin nhắn",
        senderId: userId,
        type: "NOTIFY",
        conversationId: conversationId,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      console.log(saveMessage);
      // const { conversationId, message } = await pinMessageService.add(
      //     messageId,
      //     _id
      // );
      // const { _id, createdAt } = saveMessage;
      // update lại message mới nhất
      await Conversation.updateOne(
        { _id: conversationId },
        { lastMessageId: saveMessage._id }
      );
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: saveMessage.createdAt } }
      );

      this.io
        .to(conversationId + "")
        .emit("new-message", { message: saveMessage });
      this.io
        .to(conversationId + "")
        .emit("action-pin-message", { message: saveMessage });

      res.status(201).json({ conversationId, saveMessage:saveMessage });
    } catch (err) {
      next(err);
    }
  }
  // [DELETE] /:messageId
  async deletePinMessage(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { messageId } = req.params;

    try {
      // const { conversationId, message } = await pinMessageService.delete(
      //     messageId,
      //     _id
      // );
      const conversation = await messageValidate.validatePinMessage(
        messageId,
        userId
      );
      const { _id, type, pinMessageIds } = conversation;
      const conversationId = _id;

      if (!type || pinMessageIds.length === 0)
        throw new MyError("Pin message only conversation");
      await Conversation.updateOne(
        { _id },
        { $pull: { pinMessageIds: messageId } }
      );
      const newMessage = new Message({
        content: "Đã bỏ ghim một tin nhắn",
        senderId: userId,
        type: "NOTIFY",
        conversationId: _id,
      });
      const saveMessage = await (await newMessage.save()).populate("senderId");
      // const { conversationId, message } = await pinMessageService.add(
      //     messageId,
      //     _id
      // );
      // const { _id, createdAt } = saveMessage;
      // update lại message mới nhất
      await Conversation.updateOne(
        { _id: conversationId },
        { lastMessageId: saveMessage._id }
      );
      await Member.updateOne(
        { conversationId, userId },
        { $set: { lastView: saveMessage.createdAt } }
      );

      this.io
        .to(conversationId + "")
        .emit("new-message", { message: saveMessage });
      this.io
        .to(conversationId + "")
        .emit("action-pin-message", { message: saveMessage });

      res.status(200).json({ conversationId, saveMessage });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MessageController;
