const mongoose = require("mongoose");
const MyError = require("../exception/MyError");
const NotFoundError = require("../exception/NotFoundError");
const ObjectId = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarColor: {
      type: String,
      default: "white",
    },
    coverImage: String,
    type: Boolean,
    dateOfBirth: {
      type: Date,
      default: new Date("2000-01-01"),
    },
    gender: {
      type: Boolean,
      default: false,
    },
    isActived: Boolean,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    isOnline: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

userSchema.index({ phoneNumber: "text" });

userSchema.statics.getById = async (_id, message = "User") => {
  const user = await User.findOne({ _id });
  if (!user) throw "error";

  return user;
};
userSchema.statics.existsById = async (_id) => {
  const user = await User.findOne({ _id, isActived: true });
  if (user) return true;
  return false;
};

userSchema.statics.checkByIds = async (ids, message = "User") => {
  for (const idEle of ids) {
    const user = await User.findOne({
      _id: idEle,
      // isActived: true,
      // isDeleted: false,
    });

    if (!user) throw new NotFoundError(message);
  }
};
userSchema.statics.getDetailById = async (_id, message = "User") => {
  const user = await User.findOne({ _id, isActived: true });
  if (!user) throw new NotFoundError(message);

  const { name, avatar, avatarColor } = user;
  return {
    _id,
    name,
    avatar,
    avatarColor,
  };
};
userSchema.statics.getListFriendsByUserId = async (_id, message = "User") => {
  const user = await User.findOne({ _id }).populate("friends");
  console.log(user);
  if (!user) throw new NotFoundError(message);
  const friends = user.friends;
  return friends;
};
userSchema.statics.checkIsFriends = async (_id, userId2) => {
  const isExists = await User.findOne({
    _id,
    friends: { $in: [userId2] },
  });
  // const isExits2 = await User.findOne({
  //   _id: userId2,
  //   friends: { $in: [_id] },
  // });
  if (isExists) return true;
  return false;
};

userSchema.statics.changeIsOnline = async (_id, isOnline) => {
  const user = await User.updateOne({ _id: _id }, { $set: { isOnline: isOnline } });
  return isOnline;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
