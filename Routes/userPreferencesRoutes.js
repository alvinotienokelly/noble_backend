// Routes/userPreferencesRoutes.js
const express = require("express");
const userPreferencesController = require("../Controllers/userPreferencesController");
const {
  createUserPreference,
  getUserPreferences,
  updateUserPreference,
  deleteUserPreference,
} = userPreferencesController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createUserPreference);
router.get("/", authMiddleware, getUserPreferences);
router.put("/:id", authMiddleware, updateUserPreference);
router.delete("/:id", authMiddleware, deleteUserPreference);

module.exports = router;
