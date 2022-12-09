const Member = require("../models/member");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const memberValidate = require("../validate/validateMember");
const User = require("../models/user");
class memberController {
  constructor(io) {
    this.io = io;
    this.leaveGroup = this.leaveGroup.bind(this);
    this.addMember = this.addMember.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
  }

  async getList(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id } = req.params;

    try {
      await Member.getByConversationIdAndUserId(id, userId);

      const users = await Member.getListInfosByConversationId(id);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async addMember(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { id } = req.params;
    const { userIds } = req.body;

    try {
        const newUserIds = userIds.filter((userIdEle) => userIdEle != userId);
        await memberValidate.validateAddMember(
            id,
            userId,
            newUserIds
        );
         // add member trong conversation
         await Conversation.updateOne(
            { _id: id },
            { $push: { members: newUserIds } }
        );
        newUserIds.forEach((userIdEle) => {
            const member = new Member({
                conversationId: id,
                userId: userIdEle,
            });
            member.save().then();
        });
        // tin nhắn thêm vào group
        const newMessage = new Message({
            senderId: userId,
            manipulatedUserIds: newUserIds,
            content: 'Đã thêm vào nhóm',
            type: 'NOTIFY',
            conversationId: id,
        });
        const saveMessage = await newMessage.save();
        //add mess vao conversation
      await Conversation.updateOne(
        { _id: id },
        { $push: { messages: saveMessage._id } }
      );
        const { _id, createdAt } = saveMessage;
        await Conversation.updateOne(
            { _id: id },
            { lastMessageId: _id }
        ).then();
        await Member.updateOne(
            { conversationId: id, userId },
            { lastView: createdAt }
        ).then()
        this.io
        .to(id + "")
        .emit("new-message", { message: saveMessage });
      userIds.forEach((userIdEle) =>
        this.io.to(userIdEle).emit("added-group", id)
      );
      this.io.to(id).emit("update-member", id);

      res.status(201).json();
    } catch (err) {
      next(err);
    }
  }

  async deleteMember(req, res, next) {
    const {user} = req;
    // const userId = user.id;
    const { id, userId } = req.params;

    try {
        await memberValidate.validateDeleteMember(
            id,
            user.id,
            userId
        );
        // xóa member trong conversation
        await Conversation.updateOne(
            { _id: id },
            { $pull: { members: userId, managerIds: user.id } }
        );
        const userDelete = await User.findById(userId);
        const {name} = userDelete;

        await Member.deleteOne({ conversationId: id, userId: userId });
        // tin nhắn thêm vào group
        const newMessage = new Message({
            senderId: user.id,
            manipulatedUserIds: [userId],
            content: `Đã xóa"${name}" ra khỏi nhóm`,
            type: 'NOTIFY',
            conversationId: id,
        });
        const saveMessage = await newMessage.save();
        await Conversation.updateOne(
          { _id: id },
          { $push: { messages: saveMessage._id } }
        );
        const { _id, createdAt } = saveMessage;
        await Conversation.updateOne(
            { _id: id },
            { lastMessageId: _id }
        ).then();
        await Member.updateOne(
            { conversationId: id, userId },
            { lastView: createdAt }
        ).then()

        this.io
        .to(id + "")
        .emit("new-message", { message: saveMessage });
      this.io.to(userId).emit("deleted-group", id);
      this.io.to(id).emit("update-member", id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  async leaveGroup(req, res, next) {
    const { user } = req;
    const userId = user.id;
    console.log(userId);
    const { id } = req.params;
    console.log(user);

    try {
        await memberValidate.validateLeaveGroup(id, userId);
        await Conversation.updateOne(
            { _id: id },
            { $pull: { members: userId, managerIds: userId } }
        );
        await Member.deleteOne({ conversationId: id, userId });
        // lưu message rời nhóm
        const newMessage = new Message({
            senderId: userId,
            content: 'Đã rời khỏi nhóm',
            type: 'NOTIFY',
            conversationId: id,
        });
        const saveMessage = await newMessage.save();
        await Conversation.updateOne(
          { _id: id },
          { $push: { messages: saveMessage._id } }
        );
        await Conversation.updateOne(
            { _id: id },
            { lastMessageId: saveMessage._id }
        ).then();
    //   const message = await memberService.leaveGroup(id, _id);

      this.io.to(id).emit("new-message", {message: saveMessage});
      this.io.to(id).emit("update-member", id);

      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = memberController;
