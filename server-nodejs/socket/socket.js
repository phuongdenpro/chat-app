const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const memberValidate = require("../validate/validateMember");
const Member = require("../models/member");
const User = require("../models/user");
// const conversationService = require("../services/conversationService");
// const messageService = require('../services/messageService');

const joinConversations = async (socketIo, userId) => {
  const conversations = await Conversation.getListByIdUser(userId);
  // console.log("conversations", conversations);

  // join conversation
  socketIo.on(conversations._id, (data) => {
    console.log("join conversation");
  });
};

const getConversations = async (socketIo, userId, next) => {
  const conversations = await Conversation.getListByIdUser(userId);
  // console.log(conversations);
  next(conversations);
};

const sendMessage = async (socketIo, message, userId) => {
  // const _message = messageService.addText(message, userId)
  const newMessage = new Message({
    conversationId: message.conversationId,
    senderId: userId,
    ...message,
  });
  const saveMessage = await newMessage.save();
  await Conversation.updateOne(
    { _id: message.conversationId },
    { $push: { messages: saveMessage._id } }
  );
  await Conversation.updateOne(
    { _id: message.conversationId },
    { lastMessageId: saveMessage._id }
  );
  // lưu xuống

  // console.log(saveMessage);
  console.log("emit to :", message.conversationId);
  socketIo.emit(message.conversationId, {
    message: saveMessage,
    type: "new-message",
  });
};

const socket = (socketIo) => {
  socketIo.on("connection", async (socket, data) => {
    console.log("New client connected " + socket.id);

    const token = socket.request._query.access;
    console.log(token);

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log("Unauthorized!");
        socket.disconnect();
        return;
      }
      console.log("decoded", decoded);
      socket.user = decoded;
      getConversations(socketIo, socket.user.id, (conversations) => {
        socketIo.emit(socket.user.id, { conversations });
        conversations.forEach((conv) => {
          console.log("socket: join room conversation id", conv._id.toString());
          socket.join(conv._id.toString() + "");
        });
      });
      console.log("socket: join room - ", socket.user.id);
      socket.join(socket.user.id + "");

      // when use close room chat
      socket.on("close-room", async (converId) => {
        // update lastView here
        console.log("have emit close-room", converId);

        const date = new Date();
        console.log(date);
        await Member.updateOne(
          { conversationId: converId, userId: socket.user.id },
          { lastView: date }
        );

        console.log("emit updateLastView to ", socket.user.id);
        socket.to(socket.user.id + "").emit("updateLastView", {
          converId,
          valueOfLastView: date,
        });
      });
    });

    if (socket.user) {
      await User.changeIsOnline(socket.user.id, true);
      console.log("emit user-online to all client");
      socket.emit("user-online", socket.user.id);
    }
    socket.on("send-message", (data) => {
      console.log("send-message", data);
      sendMessage(socketIo, data.message, socket.user.id);
      // getConversations(
      //   socketIo, socket.user.id,
      //   (conversations) => socketIo.emit(socket.id, { conversations }))
    });

    socket.on("join-conversation", function (data) {
      console.log("join-conversation", data);
      // check user có trong conversation không

      // end check
      socket.join(data.conversationId);
    });
    socket.on("leave-conversation", function (data) {
      console.log("leave-conversation", data);
      // end check
      socket.leave(data.conversationId);
    });

    socket.on("typing", (conversationId, me) => {
      socket.broadcast.to(conversationId).emit("typing", conversationId, me);
    });

    socket.on("not-typing", (conversationId, me) => {
      socket.broadcast
        .to(conversationId)
        .emit("not-typing", conversationId, me);
    });

    socket.on("conversation-last-view", (conversationId) => {
      const { userId } = socket;
      memberValidate
        .updateLastViewOfConversation(conversationId, userId)
        .then(() => {
          socket.to(conversationId + "").emit("user-last-view", {
            conversationId,
            userId,
            lastView: new Date(),
          });
        })
        .catch((err) => console.log("Error socket conversation-last-view"));
    });
    // call video
    socket.on("call-video", ({ conversationId, newUserId, peerId }) => {
      socket.join(conversationId + "call");
      socket.broadcast.to(conversationId + "call").emit("user-connected", {
        conversationId,
        newUserId,
        peerId,
      });
      socket.on('user-disconnect-call', () => {
        socket.to(conversationId+ "call").broadcast.emit('user-disconnected-call', newUserId)
      })
    });
    socket.on("disconnect", async () => {
      console.log("Client disconnected");
      await User.changeIsOnline(socket.user.id, false);
      socket.emit("user-offline", socket.user.id);
    });
  });
};

module.exports = socket;
