const MessageController = require("../controllers/messageController");
const Message = require("../models/message");
const router = require("express").Router();
const uploadFile = require("../uploads/uploadFile");

const messageRouter = (io) => {
  const messageController = new MessageController(io);

  //[GET] conversationId : req.params
  router.get("/:messageId", messageController.getById);

  //[GET] conversationId : req.params
  router.get("/by_conversation/:conversationId", messageController.getList);
  //[POST] conversationId: req.body, new Message(): req.body, type:"TEXT"
  router.post("/text", messageController.addText);
  //[POST] type: IMAGE, FILE, VIDEO // conversationId: id conversationId cần gửi file, file = req.file
  router.post(
    "/file/:type/:conversationId",
    uploadFile.singleUploadMiddleware,
    messageController.addFile
  );
  //[DELETE]/:id {_id}: req.params, conversationId: req.body //Thu hồi tin nhắn
  router.delete("/:id", messageController.reCallMessageById);
  //[DELETE]/:id/only req.params, conversationId: req.body //Xóa ở phía tôi
  router.delete("/:id/only", messageController.deleteOnlyMeById);
  //[POST]/:/id/reacts/:type {:id}: id message, :type react
  router.post("/:id/reacts/:type", messageController.addReaction);
  //[POST]:id: req.params--id của tin nhắn cần share, conversationId: req.params -- id conversation cần gửi tin nhắn
  router.post("/:id/share/:conversationId", messageController.shareMessage);

  //Ghim tin nhắn
  //[GET] conversationId : req.params
  router.get("/pins/:conversationId", messageController.getAllPinMessages);
  //[POST] messageId
  router.post("/pins/:messageId", messageController.addPinMessage);
  //[DELETE] messageId
  router.delete("/pins/:messageId", messageController.deletePinMessage);

  return router;
};

module.exports = messageRouter;
