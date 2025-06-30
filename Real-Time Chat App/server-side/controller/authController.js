const { compare } = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const path = require("path");

const fs = require("fs/promises");

const maxAge = 3 * 24 * 60 * 60; // in seconds for jwt
const cookieMaxAge = maxAge * 1000; // milliseconds for cookie

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
const SignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password is required.." });
    }

    // Check if user already exists (optional but important)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const user = await User.create({ email, password });

    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true,
      maxAge: cookieMaxAge,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "server error" });
  }
};

const loginUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Password is incorrect." });
    }

    // Set JWT cookie
    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true,
      maxAge: cookieMaxAge,
      secure: false,
      sameSite: "Lax",
    });

    // Send saved data directly
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found. not id match" });
    }
    return res.status(201).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      fisrtName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;

    // Validate inputs
    if (!firstName || !lastName || color === undefined) {
      return res.status(400).json({ 
        message: "First name, last name, and color are required."
      });
    }

    // Update user in DB
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true, // mark as setup complete
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const profileImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Get file extension & create new file name
    const ext = path.extname(req.file.originalname);
    const newFileName = `${Date.now()}${ext}`;
    const newPath = path.join("uploads/profiles", newFileName);

    // Rename (move) file
    await fs.rename(req.file.path, newPath);

    // Store relative path in DB
    const imagePath = `uploads/profiles/${newFileName}`;

    // Update user with new image
    const user = await User.findByIdAndUpdate(
      userId,
      { image: imagePath },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
      message: "Profile image updated successfully."
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const removeProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user || !user.image) {
      return res.status(404).json({ message: "Profile image not found." });
    }

    // Absolute file path
    const imagePath = path.join(__dirname, "..", user.image);

    // Delete image file
    await fs.unlink(imagePath);

    // Remove reference from DB
    user.image = undefined;
    await user.save();

    return res.status(200).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
      message: "Profile image removed successfully."
    });
  } catch (error) {
    console.error("Remove profile image error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const LogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { cookieMaxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.error("Remove profile image error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  SignUp,
  loginUp,
  userInfo,
  updateProfile,
  profileImage,
  removeProfileImage,
  LogOut,
};
