// Routes/dealTypePreferencesRoutes.js
const express = require("express");
const dealTypePreferencesController = require("../Controllers/dealTypePreferencesController");
const {
  createDealTypePreference,
  getDealTypePreferences,
  createMultipleDealTypePreferences,
  updateDealTypePreference,
  deleteDealTypePreference,
  getUniqueDealTypePreferences, // Add this line
} = dealTypePreferencesController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDealTypePreference);
router.get("/", authMiddleware, getDealTypePreferences);
router.get("/unique", authMiddleware, getUniqueDealTypePreferences); // Add this line
router.post("/multiple", authMiddleware, createMultipleDealTypePreferences); // Add this line
router.put("/:id", authMiddleware, updateDealTypePreference);
router.delete("/:id", authMiddleware, deleteDealTypePreference);

module.exports = router;
