const bcrypt = require("bcrypt");
const Conversation = require("../models/conversation");
// const conversationService = require("../services/conversationService");
// const messageService = require('../services/messageService');
const MyError = require("../exception/MyError");
const User = require("../models/user");
const conversationValidate = require("../validate/validateConversation");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Member = require("../models/member");
const Message = require("../models/message");
const FriendRequest = require("../models/friendRequest");
const conversationConller = require("./conversationControllers");
const userValidate = require("../validate/validateUser");
const AwsS3Upload = require("../uploads/awsS3Upload");
const commonUtils = require('../utils/commonUtils');
class MeController {
  constructor(io) {
    this.io = io;
    this.updateProfile = this.updateProfile.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
  }
  // [GET] /profile
  async getProfile(req, res, next) {
    const { user } = req;
    const userId = user.id;
    console.log(userId);

    try {
      const user = await User.getById(userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
  // [PUT] /profile
  async updateProfile(req, res, next) {
    const { user } = req;
    const userId = user.id;
    console.log(userId);
    const profile = req.body;

    try {
      if (!profile) throw new MyError("Profile invalid");
      await User.getById(userId);
      await User.updateOne({ _id: userId }, { ...profile });
      const userInFo = await User.getById(userId); 
      this.io.to(userId + "").emit("update-avatar", userId, userInFo);
      res.json();
    } catch (err) {
      next(err);
    }
  }
  // [PATCH] /avatar
  async changeAvatar(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const file = req.file;

    try {
      const { mimetype } = file;

      if (mimetype !== "image/jpeg" && mimetype !== "image/png")
        throw new MyError("Image invalid");
      const user = await User.getById(userId);
      const { avatar } = user;
      if (avatar) await AwsS3Upload.deleteFile(avatar);

      const avatarUrl = await AwsS3Upload.uploadFile(file);
      await User.updateOne({ _id: userId }, { avatar: avatarUrl });
      // const avatar = await meService.changeAvatar(_id, file);
      this.io.to(userId + "").emit("change-avatar", userId, avatarUrl);
      return res.json({ avatarUrl });
    } catch (err) {
      next(err);
    }
  }
  // [PATCH] /password
  async changePassword(req, res, next) {
    const { user } = req;
    const userId = user.id;
    const { oldPassword, newPassword } = req.body;

    try {
      const { password } = await User.getById(userId);
        const isPasswordMatch = await bcrypt.compare(oldPassword, password);
        if (!isPasswordMatch) throw new MyError('Password wrong');
        const hashPassword = await commonUtils.hashPassword(newPassword);
        await User.updateOne({ _id: userId }, { $set: { password: hashPassword } });

        res.status(200).json("Change password success!");
    } catch (err) {
        next(err);
    }
}
}

module.exports = MeController;
