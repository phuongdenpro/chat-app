const mongoose = require("mongoose");
const conversationValidate = require("../validate/validateConversation");
const Conversation = require("../models/conversation");
const Member = require("../models/member");
const Message = require("../models/message");
const NotFoundError = require("../exception/NotFoundError");
const friendRequestSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
friendRequestSchema.statics.existsByIds = async (senderId, receiverId) => {
  const isExists = await FriendRequest.findOne({
    senderId,
    receiverId,
  });

  if (isExists) return true;

  return false;
};

friendRequestSchema.statics.checkByIds = async (
  senderId,
  receiverId,
  message = "Invite"
) => {
  const isExists = await FriendRequest.findOne({
    senderId,
    receiverId,
  });

  if (!isExists) throw new NotFoundError(message);
};

friendRequestSchema.statics.deleteByIds = async (
  senderId,
  receiverId,
  message = "Invite"
) => {
  const queryResult = await FriendRequest.deleteOne({ senderId, receiverId })
    .then(function () {
      console.log("Friend request deleted"); // Success
    })
    .catch(function (error) {
      throw new NotFoundError(message); // Failure
    });
};
friendRequestSchema.statics.getListFriendsInvite = async (receiverId) => {
  const senders = await FriendRequest.find({ receiverId: receiverId }).populate(
    "senderId"
  );
  return senders;
};
friendRequestSchema.statics.getListInvitesWasSend = async (senderId) => {
  const receiver = await FriendRequest.find({ senderId: senderId }).populate(
    "receiverId"
  );
  return receiver;
};
friendRequestSchema.statics.createConversation = async (userId, senderId) => {
  const { name1, name2, conversationId } =
    await conversationValidate.validateSimpleConversation(userId, senderId);
  console.log(conversationId);
  // res.status(200).json(conversationId);
  if (conversationId) return { _id: conversationId, isExists: true };
  console.log(name1);
  const newConversation = new Conversation({
    members: [userId, senderId],
    type: false,
  });
  const saveConversation = await newConversation.save();
  // const saveConversation = await (await newConversation.save())
  //   .populate("members")
  //   .populate("messages");
  const { _id } = saveConversation;
  // tạo 2 member
  const member1 = new Member({
    conversationId: _id,
    userId: userId,
    name: name1,
  });

  const member2 = new Member({
    conversationId: _id,
    userId: senderId,
    name: name2,
  });

  // save
  member1.save().then();
  member2.save().then();
  return { _id, isExists: false };
};

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
module.exports = FriendRequest;
