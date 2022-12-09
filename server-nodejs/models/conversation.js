const mongoose = require("mongoose");
const NotFoundError = require("../exception/NotFoundError");
const ObjectId = mongoose.Types.ObjectId;

const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    leaderId: {
      type: ObjectId,
      ref: "User",
    },
    managerIds: {
      type: [ObjectId],
      default: [],
    },
    members: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: ObjectId,
        ref: "Message",
      },
    ],
    lastMessageId: {
      type: ObjectId,
      ref: "Message",
    },
    pinMessageIds: [
      {
        type: ObjectId,
        ref: "Message",
      },
    ],
    type: Boolean,
  },
  { timestamps: true }
);
conversationSchema.index({ name: "text" });
conversationSchema.statics.existsSimpleConversation = async (
  userId1,
  userId2
) => {
  const conversation = await Conversation.findOne({
    type: false,
    members: { $all: [userId1, userId2] },
  });

  if (conversation) return conversation._id;
  return null;
};

conversationSchema.statics.getByIdAndUserId = async (
  _id,
  userId,
  message = "Conversation"
) => {
  const conversation = await Conversation.findOne({
    _id,
    members: { $in: [userId] },
  }).sort({ updatedAt: -1 }).populate("members")
  .populate({ 
    path: 'messages',
    populate: {
      path: 'senderId',
      model: 'User'
    } 
  }).populate({
    path: "lastMessageId",
    populate: {
      path: "senderId",
      model: "User",
    },
  }).populate({
    path: "pinMessageIds",
    populate: {
      path: "senderId",
      model: "User",
    },
  });

  if (!conversation) throw new NotFoundError(message);

  return conversation;
};

conversationSchema.statics.getById = async (_id, message = "Conversation") => {
  const conversation = await Conversation.findById(_id).populate("members")
  .populate({ 
    path: 'messages',
    populate: {
      path: 'senderId',
      model: 'User'
    } 
  }).populate({
    path: "lastMessageId",
    populate: {
      path: "senderId",
      model: "User",
    },
  });
  if (!conversation) throw new NotFoundError(message);

  return conversation;
};

conversationSchema.statics.existsByUserIds = async (
  _id,
  userIds,
  message = "Conversation"
) => {
  const conversation = await Conversation.findOne({
    _id,
    members: { $all: [...userIds] },
  });

  if (!conversation) throw new NotFoundError(message);

  return conversation;
};
conversationSchema.statics.getListByIdUser = async(userId)=>{
  let conversations = await Conversation.find({
    members: { $in: [userId] },
  })
    .sort({ updatedAt: -1 })
    .populate("members")
    .populate({ 
      path: 'messages',
      populate: {
        path: 'senderId',
        model: 'User'
      } 
    }).populate({
      path: "lastMessageId",
      populate: {
        path: "senderId",
        model: "User",
      },
    });

  // const messages = await Message.getListByIdConversation(conversation._id);
  // console.log(user.id);
  // res.json(conversations);
  return conversations;
}

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
