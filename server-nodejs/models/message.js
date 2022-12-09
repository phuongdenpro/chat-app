const mongoose = require("mongoose");
const NotFoundError = require("../exception/NotFoundError");
const ObjectId = mongoose.Types.ObjectId;
const messageSchema = mongoose.Schema(
  {
    conversationId:{
      type: ObjectId,
      ref: "Conversation",
    },
    content: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    senderId: {
      type: ObjectId,
      ref: "User"
    },
    manipulatedUserIds: {
      type: [ObjectId],
      default: [],
    },
    replyMessageId: ObjectId,
    type: {
      type: String,
      enum: [
        "TEXT",
        "IMAGE",
        "STICKER",
        "VIDEO",
        "FILE",
        "VOTE",
        "HTML",
        "NOTIFY",
      ],
      required: true,
    },
    reacts: {
      type: [
        {
          userId: ObjectId,
          type: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6],
          },
        },
      ],
      default: [],
    },
    deletedWithUserIds: {
      type: [ObjectId],
      ref:"User",
      default: [],
    },
    createdAt: Date,
    updatedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// conversationSchema.statics.getListByIdUser = async(userId)=>{
//   let conversations = await Conversation.find({
//     members: { $in: [userId] },
//   })
//     .sort({ updatedAt: -1 })
//     .populate("members")
//     .populate("messages").populate("lastMessageId");

//   // const messages = await Message.getListByIdConversation(conversation._id);
//   // console.log(user.id);
//   // res.json(conversations);
//   return conversations;
// }
messageSchema.statics.getListByIdConversation = async (_id) => {
  const messages = await Message.find({
    conversationId: { $in: _id },
  }).sort({ updatedAt: 1 }).populate("senderId");
if (messages.length > 0) return messages;

throw new NotFoundError('Message');
};

messageSchema.statics.countUnread = async (time, conversationId) => {
  return await Message.countDocuments({
    createdAt: { $gt: time },
    conversationId,
  });
};

messageSchema.statics.getById = async (_id, message = "Message") => {
  const messageResult = await Message.findById(_id).populate("senderId");

  if (!messageResult) throw new NotFoundError(message);

  return messageResult;
};

messageSchema.statics.getByIdAndConversationId = async (
  _id,
  conversationId,
  message = "Message"
) => {
  const messageResult = await Message.findOne({
    _id,
    conversationId,
  }).populate("senderId");

  if (!messageResult) throw new NotFoundError(message);

  return messageResult;
};

messageSchema.statics.getListFilesByTypeAndConversationId = async (
  type,
  conversationId,
  userId,
  skip,
  limit
) => {
  const files = await Message.find(
    {
      conversationId,
      type,
      isDeleted: false,
      deletedUserIds: { $nin: [userId] },
    },
    {
      userId: 1,
      content: 1,
      type: 1,
      createdAt: 1,
    }
  )
    .skip(skip)
    .limit(limit);

  return files;
};
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
