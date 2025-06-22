const express = require("express");
const router = express.Router();

const authControllers = require("../controller/authController");
const verifyToken = require("../middleware/authMiddleware");

const multer = require("multer");

const uploads = multer({ dest: "uploads/profiles" });

router.post("/signup", authControllers.SignUp);
router.post("/login", authControllers.loginUp);
router.get("/user", verifyToken, authControllers.userInfo);
router.put("/update-Profile", verifyToken, authControllers.updateProfile);
router.post(
  "/profile-image",
  verifyToken,
  uploads.single("profile-image"),
  authControllers.profileImage
);

router.delete("/remove-profile",verifyToken,authControllers.removeProfileImage)

router.post("/logout",authControllers.LogOut)

module.exports = router;
