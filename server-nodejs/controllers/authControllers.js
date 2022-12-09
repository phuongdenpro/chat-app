const bcrypt = require('bcrypt');
const User  = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

var refreshTokens = [];

const authController = {
  loginByToken: (req, res) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, config.secret, async (err, user) => {
        if (err) {
          return res.status(403).json("token is not valid");
        }
        const user2 = await User.findOne({ phoneNumber: user.phoneNumber });
        if (!user2) {
          return res.status(404).json("token is not valid");
        }

        const accessToken = authController.generateAccessToken(user2);
        const refreshToken = authController.generateRefreshToken(user2);
        refreshTokens.push(refreshToken);

        //save refreshToken in cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user2._doc;
        return res.status(200).json({ ...others, accessToken, refreshToken });
      });
    } else {
      return res.status(401).json("you have not authenticated yet");
    }
  },

  //generate accessToken
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
      config.secret,
      { expiresIn: "30d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
      process.env.REFRESHTOKEN,
      { expiresIn: "365d" }
    );
  },

  //generate refreshToken

  register: async (req, res) => {
    
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await new User({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        password: hash,
      });
      const saveUser = await user.save();
      return res.status(200).json(saveUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({isSuccess :false});
    }
  },
  loginUser: async (req, res) => {
    console.log(req.body);
    try {
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber });

      if (!user) {
        return res.status(404).json("phoneNumber is not correct");
      }
      const validatePassword = await bcrypt.compare(req.body.password,user.password);
      if (!validatePassword) {
        return res.status(404).json("password is not correct");
      }
      if (user && validatePassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        //save refreshToken in cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // request new access token from refresh token in cookies
  requesRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json("you have not't authenticated yet");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.REFRESHTOKEN, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccesToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccesToken });
    });
  },

  //logout
  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("log out done");
  },
};
module.exports = authController;
