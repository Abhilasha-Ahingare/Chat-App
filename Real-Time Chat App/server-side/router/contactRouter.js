const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const contactController = require("../controller/contactController");

router.post("/search", verifyToken, contactController.SearchContact);
router.get("/get-contacts", verifyToken, contactController.GetContactDamList);
router.get("/get-all-contacts", verifyToken, contactController.GetAllContact);
module.exports = router;
