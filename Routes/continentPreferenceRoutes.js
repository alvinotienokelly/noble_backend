// Routes/continentPreferenceRoutes.js
const express = require("express");
const continentPreferenceController = require("../Controllers/continentPreferenceController");
const {
  createContinentPreference,
  getContinentPreferences,
  updateContinentPreference,
  deleteContinentPreference,
  getUserContinentPreferences,
} = continentPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createContinentPreference);
router.get("/user", authMiddleware, getUserContinentPreferences);
router.get("/", authMiddleware, getContinentPreferences);
router.put("/:id", authMiddleware, updateContinentPreference);
router.delete("/:id", authMiddleware, deleteContinentPreference);

module.exports = router;
