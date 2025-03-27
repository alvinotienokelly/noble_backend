const express = require("express");
const { sendTestEmail } = require("../Controllers/emailController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/send-email", authMiddleware, sendTestEmail);

module.exports = router;
