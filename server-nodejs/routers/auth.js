const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.register);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requesRefreshToken);
router.post("/logout",middlewareController.verifyToken,authController.logoutUser);
router.get("/login", authController.loginByToken);

module.exports = router;
