// Routes/dealTypePreferencesRoutes.js
const express = require("express");
const dealTypePreferencesController = require("../Controllers/dealTypePreferencesController");
const {
  createDealTypePreference,
  getDealTypePreferences,
  createMultipleDealTypePreferences,
  updateDealTypePreference,
  deleteDealTypePreference,
} = dealTypePreferencesController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDealTypePreference);
router.get("/", authMiddleware, getDealTypePreferences);
router.post("/multiple", authMiddleware, createMultipleDealTypePreferences); // Add this line
router.put("/:id", authMiddleware, updateDealTypePreference);
router.delete("/:id", authMiddleware, deleteDealTypePreference);

module.exports = router;
