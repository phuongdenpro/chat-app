const e = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const userControllers = {
  //ADD USER
  addUser: async (req, res) => {
    console.log(req.body);
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },


  //UPDATE USER  [put]/user/:id
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      await user.updateOne({ $set: req.body });
      res.status(200).json("update succesful");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //UPDATE PASSWORD [PUT]/user/password/:id
  updatePassword: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      const user = await User.findById(req.params.id);
      await user.updateOne({ $set: { password: passwordHash } });

      return res.status(200).json("update successful!");
    } catch (error) {
      console.log(error);
      return res.status(403).json("failed");
    }
  },
  //GET ALL USER  [get]/user/
  getUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //GET AN USER  [get] /user/:id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //DELETE USER [DEL] /user/:id
  deleteUser: async (req, res) => {
    try {
      await User.updateMany(
        { friends: req.params.id },
        { $pull: { friends: req.params.id } }
      );
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("deleted successful");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  //FIND USER BY PHONE NUMBER [GET] /USER/PHONENUMBER/:phonenumber
  getUserByPhoneNumber: async (req, res) => {
    const { phoneNumber } = req.params;
    try {
      const user = await User.findOne({ phoneNumber: phoneNumber });
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.json(400).json({ isSucces: false });
    }
  },
};

module.exports = userControllers;
