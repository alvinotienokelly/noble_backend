// Routes/continentPreferenceRoutes.js
const express = require("express");
const countryPreferenceController = require("../Controllers/countryPreferenceController");
const {
  createCountryPreference,
  getCountryPreferences,
  updateCountryPreference,
  deleteCountryPreference,
  bulkCreateCountryPreferences, // Add this line
} = countryPreferenceController;

const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCountryPreference);
router.post("/bulk", authMiddleware, bulkCreateCountryPreferences); // Add this line
router.get("/", authMiddleware, getCountryPreferences);
router.put("/:id", authMiddleware, updateCountryPreference);
router.delete("/:id", authMiddleware, deleteCountryPreference);

module.exports = router;
