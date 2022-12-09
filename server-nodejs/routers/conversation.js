const ConversationController = require("../controllers/conversationControllers");
const router = require("express").Router();
const MemberController = require("../controllers/memberController");
const uploadFile = require("../uploads/uploadFile");
const conversationRouter = (io) => {
  const conversationController = new ConversationController(io);
  const memberController = new MemberController(io);
  //[GET]
  router.get(
    "/last-view-member",
    conversationController.getLastViewOfUserAllConversation
  );
  //[DELETE] :id params // id của conversation, managerId: req.body, xóa manager cho nhóm, chỉ leader mới xóa được
  router.delete(
    "/:id/managers",
    conversationController.deleteManagersForConversation
  );
  //[DELETE] :id params // id của conversation, managerId: req.body, xóa manager cho nhóm, chỉ leader mới xóa được
  router.post(
    "/:id/managers/leave",
    conversationController.deleteManagersForConversation
  );
  //[GET]
  router.get("", conversationController.getList);
  // [GET] /:id
  router.get("/:id", conversationController.getConversationSummary);


  //[GET]/:id/last-view Get lastview của một conversation của member trong conver
  router.get("/:id/last-view", conversationController.getLastViewOfMembers);

  //[POST] userId: req.body
  router.post("", conversationController.createConversationSimple);
  //[POST] userIds: req.body, name: req.body
  router.post("/groups", conversationController.createGroupConversation);
  //[POST]:id params id conversation, name: req.body, đổi tên conversation
  router.patch("/:id/name", conversationController.rename);
  //[POST]:id params id conversation, file: req.file, cập nhập avatar conversation
  router.patch(
    "/:id/avatar",
    uploadFile.singleUploadMiddleware,
    conversationController.updateAvatar
  );
  //[DELETE] :id params // id conversation cần xóa, chỉ leaderId mới xóa được nhóm
  router.delete("/:id", conversationController.deleteConversationByLeader);
  //[DELETE] :id params// id của conversation, xóa tất cả tin nhắn ở phía tôi của user request
  router.delete("/:id/messages", conversationController.deleteAllMessage);
  //[POST] :id params // id của conversation, managerId: req.body, thêm manager cho nhóm, chỉ leader mới thêm được
  router.post(
    "/:id/managers",
    conversationController.addManagersForConversation
  );
  
  // // members
  //[GET] :id params -- id của conversation cần get list member
  router.get("/:id/members", memberController.getList);
  //[DELETE] :id params -- id của conversation mà user request tham gia, leader không thể rời nhóm, chỉ có xóa nhóm
  router.delete("/:id/members/leave", memberController.leaveGroup);
  //[POST] :id params -- id của conversation, userIds: req.body -- list userId thêm vào nhóm
  router.post("/:id/members", memberController.addMember);
  //[DELETE] :id params -- id của conversation, userId: req.params -- userId cần xóa ra khỏi nhóm, chỉ leader mới xóa được member ra khỏi nhóm
  router.delete("/:id/members/:userId", memberController.deleteMember);
  //[DELETE] :id params -- id của conversation mà user request tham gia, leader không thể rời nhóm, chỉ có xóa nhóm
  router.delete("/:id/members/leave", memberController.leaveGroup);

  router.post("/:id/leave", memberController.leaveGroup);

  return router;
};

module.exports = conversationRouter;
