const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { GetMessage, uploadFiles } = require("../controller/messagesController");
const multer = require("multer");

const upload = multer({ dest: "uploads/files" });
router.post("/get-messages", verifyToken, GetMessage);
router.post("/uploads-file", verifyToken, upload.single("file"), uploadFiles);

module.exports = router;