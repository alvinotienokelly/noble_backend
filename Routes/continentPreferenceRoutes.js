// Routes/continentPreferenceRoutes.js
const express = require("express");
const continentPreferenceController = require("../Controllers/continentPreferenceController");
const {
  createContinentPreference,
  getContinentPreferences,
  updateContinentPreference,
  deleteContinentPreference,
  bulkCreateContinentPreferences, // Add this line
  getUserContinentPreferences,
} = continentPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createContinentPreference);
router.post("/bulk", authMiddleware, bulkCreateContinentPreferences); // Add this line
router.get("/user", authMiddleware, getUserContinentPreferences);
router.get("/", authMiddleware, getContinentPreferences);
router.put("/:id", authMiddleware, updateContinentPreference);
router.delete("/:id", authMiddleware, deleteContinentPreference);

module.exports = router;
