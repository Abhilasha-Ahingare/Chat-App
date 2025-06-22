const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const CreateChannel = require("../controller/ChannelController");

router.post("/create-channel", verifyToken, CreateChannel);

module.exports = router;
