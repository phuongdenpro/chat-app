const Conversation = require("../models/conversation");
const Message = require("../models/message");
const MyError = require("../exception/MyError");

const validateMessage = {
  validateTextMessage: async (message, userId) => {
    const { content, type, replyMessageId, tags, conversationId } = message;

    // check type
    if (
      !type ||
      (type !== "TEXT" &&
        type !== "HTML" &&
        type !== "NOTIFY" &&
        type !== "STICKER")
    )
      throw "Type only TEXT, HTML, NOTIFY, STICKER";

    if (!content) throw "Content not empty";

    // check userIds có trong conversation
    let userIds = [];
    if (tags) {
      const index = tags.findIndex((userIdEle) => userIdEle == userId);

      if (index !== -1) throw "No tag yourself";
      userIds = [...tags];
    }

    userIds.push(userId);
    await Conversation.existsByUserIds(conversationId, userIds);
    // check replyMessageId có tồn tại
    if (replyMessageId) {
      await Message.getByIdAndConversationId(replyMessageId, conversationId);
    }
  },
  validateFileMessage: async (
    file,
    type,
    conversationId,
    userId
) => {
    if (type !== 'IMAGE' && type !== 'VIDEO' && type !== 'FILE')
        throw new MyError('Type only IMAGE, VIDEO, FILE');

    const { mimetype } = file;

    if (type === 'IMAGE')
        if (
            mimetype !== 'image/png' &&
            mimetype !== 'image/jpeg' &&
            mimetype !== 'image/gif'
        )
            throw new MyError('Image mimetype invalid');

    if (type === 'VIDEO')
        if (mimetype !== 'video/mp3' && mimetype !== 'video/mp4')
            throw new MyError('Video mimetype invalid');

    if (type === 'FILE')
        if (
            mimetype !== 'application/pdf' &&
            mimetype !== 'application/msword' &&
            mimetype !==
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
            mimetype !== 'application/vnd.ms-powerpoint' &&
            mimetype !==
                'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
            mimetype !== 'application/vnd.rar' &&
            mimetype !== 'application/zip' &&
            mimetype !== 'application/xlsx' &&
            mimetype !== 'application/txt'
        )
            throw new MyError('File mimetype invalid');

    // check có conversation
    await Conversation.getByIdAndUserId(conversationId, userId);

    
},
validatePinMessage: async (messageId, userId) => {
  const message = await Message.getById(messageId);
  const { conversationId } = message;

  const conversation = await Conversation.getByIdAndUserId(
      conversationId,
      userId
  );

  const { type } = conversation;

  if (!type) throw new MyError('Only Conversation');

  return conversation;
},
};

module.exports = validateMessage;
