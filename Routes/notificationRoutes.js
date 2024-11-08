// Routes/notificationRoutes.js
const express = require("express");
const notificationController = require("../Controllers/notificationController");
const { getUserNotifications, markNotificationAsRead } = notificationController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/:id/read", authMiddleware, markNotificationAsRead);

module.exports = router;