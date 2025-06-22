const MessageModel = require("../models/messageModel");
const User = require("../models/userModel");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const GetMessage = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json(" Both user ID's are  required");
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timeStamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file is required" });
    }
    const date = Date.now();
    const fileDir = path.join("uploads", "files", date.toString());
    const fileName = path.join(fileDir, req.file.originalname);

    await fsPromises.mkdir(fileDir, { recursive: true });
    await fsPromises.rename(req.file.path, fileName);

    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { GetMessage, uploadFiles };
