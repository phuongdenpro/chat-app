const router = require("express").Router();
const FriendController = require("../controllers/friendControllers");

const friendRouter = (io) => {
  const friendController = new FriendController(io);

  router.get("", friendController.getListFriends);
  //[POST]:/userId, userId: req.params id của người cần xóa kết bạn
  router.delete("/:userId", friendController.deleteFriend);
  //[POST]/:userId , userId: req.params chấp nhận id của người gửi lời mời kết bạn
  router.post("/:senderId", friendController.acceptFriend);
  //[POST]/invites/me/:userId gửi lời mời kết bạn đến userId
  router.post("/invites/me/:userId", friendController.sendFriendInvite);
  //[GET]/invites Get list lời mời kết bạn
  router.get("/invites", friendController.getListFriendInvites);
  //[DELETE]/invites/:userId userId:req.params //Xóa lời mời kết bạn của userId
  router.delete("/invites/:userId", friendController.deleteFriendInvite);
  //[GET]/invites/me get list lời mời kết bạn mà bạn đã gửi
  router.get("/invites/me", friendController.getListFriendInvitesWasSend);
  //[DELETE]/invites/me/:userId xóa lời mời kết bạn bạn đã gửi đến userId
  router.delete("/invites/me/:userId", friendController.deleteInviteWasSend);

  return router;
};

module.exports = friendRouter;
