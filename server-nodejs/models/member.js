const mongoose = require("mongoose");
const NotFoundError = require("../exception/NotFoundError");
const ObjectId = mongoose.Types.ObjectId;
const memberSchema = mongoose.Schema({
  conversationId: {
    type: ObjectId,
    ref: "Conversation",
  },
  userId: {
    type: ObjectId,
    ref: "User",
  },
  lastView: {
    type: Date,
    default: new Date(),
  },
  name: String,
  isNotify: {
    type: Boolean,
    default: true,
  },
});
memberSchema.statics.getByConversationIdAndUserId = async (
  conversationId,
  userId,
  message = "Conversation"
) => {
  const member = await Member.findOne({
    conversationId,
    userId,
  });

  if (!member) throw new NotFoundError(message);

  return member;
};

memberSchema.statics.existsByConversationIdAndUserId = async (
  conversationId,
  userId
) => {
  const member = await Member.findOne({
    conversationId,
    userId,
  });

  if (!member) return false;

  return true;
};

memberSchema.statics.getListInfosByConversationId = async (conversationId) => {
  const users = await Member.find({ conversationId: conversationId }).populate(
    "userId"
  );
  return users;
};
memberSchema.statics.getListMemberOfUserId = async (userId) => {
  const members = await Member.find({ userId: userId }).populate("userId");
  return members;
};
const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
