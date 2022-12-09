const router = require("express").Router();
const MeController = require("../controllers/meController");
const uploadFile = require("../uploads/uploadFile");

const meRouter = (io) => {
  const meController = new MeController(io);
  //[GET] get thông tin của tôi
  router.get("/profile", meController.getProfile);
  //[PUT] Cập nhập thông tin của tôi -- profile:req.body: Thông tin cần thay đổi
  router.put("/profile", meController.updateProfile);
  //[PATCH] cập nhập avatar của tôi
  router.patch("/avatar",uploadFile.singleUploadMiddleware, meController.changeAvatar);
  //[PATCH] cập nhập password me
  router.patch("/password", meController.changePassword);
  
  return router;
};

module.exports = meRouter;
