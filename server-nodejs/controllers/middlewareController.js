const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const config = require("../config/config");

const middlewareController = {
  //credential
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];

      jwt.verify(accessToken, config.secret, async (err, user) => {
        if (err) {
          return res.status(403).json("token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("you have not authenticated yet");
    }
  },
  verifyAdminOwner: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id) {
        next();
      } else {
        return res
          .status(403)
          .json("your act have been dined, you don't have permision");
      }
    });
  },
};

module.exports = middlewareController;
