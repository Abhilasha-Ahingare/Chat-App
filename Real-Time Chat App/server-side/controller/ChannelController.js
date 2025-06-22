const User = require("../models/userModel");
const Channel = require("../models/ChannelModel");

const CreateChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json("admin user not found..");
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).json("some memeber are not valid users");
    }

    const newChannel = new Channel({ name, members, admin: userId });
    await newChannel.save();
    return res.status(201).json({ newChannel });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = CreateChannel;
