const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const MessageModel = require("../models/messageModel");

const SearchContact = async (req, res) => {
  try {
    const { searchItem } = req.body;

    if (!searchItem) {
      return res.status(400).json("searchItem is required");
    }

    // ✅ Fix: Escape special characters properly
    const santizedSearchItem = searchItem.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(santizedSearchItem, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // ✅ Make sure req.userId is set in middleware
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GetContactDamList = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timeStamp: -1 }, // sort by most recent messages first
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timeStamp" }, // ✅ FIXED this line
        },
      },
      {
        $lookup: {
          from: "users", // ✅ make sure this matches your actual MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo", // ✅ to flatten the array from $lookup
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GetAllContact = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { SearchContact, GetContactDamList, GetAllContact };
