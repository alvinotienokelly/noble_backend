// Routes/userTicketPreferencesRoutes.js
const express = require("express");
const userTicketPreferencesController = require("../Controllers/userTicketPreferencesController");
const { createUserTicketPreference, getUserTicketPreferences, updateUserTicketPreference, deleteUserTicketPreference } = userTicketPreferencesController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createUserTicketPreference);
router.get("/", authMiddleware, getUserTicketPreferences);
router.put("/:id", authMiddleware, updateUserTicketPreference);
router.delete("/:id", authMiddleware, deleteUserTicketPreference);

module.exports = router;