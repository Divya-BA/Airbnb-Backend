const User = require("../models/User");
const cookieToken = require("../utils/cookieToken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already registered!",
      });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    cookieToken(user, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server Error",
      error: err,
    });
  }
};

// Login/SignIn user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
      });
    }

    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email or password is incorrect!",
      });
    }

    cookieToken(user, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server Error",
      error: err,
    });
  }
};

// Upload picture
exports.uploadPicture = async (req, res) => {
  const { path } = req.file;
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: "Airbnb/Users",
    });
    res.status(200).json(result.secure_url);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal server error",
    });
  }
};

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return (
        res.status(404),
        json({
          message: "User not found",
        })
      );
    }

    user.name = name;
    if (picture && !password) {
      user.picture = picture;
    } else if (password && !picture) {
      user.password = password;
    } else {
      user.picture = picture;
      user.password = password;
    }
    const updatedUser = await user.save();
    cookieToken(updatedUser, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }, error);
  }
};

// Logout
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};
