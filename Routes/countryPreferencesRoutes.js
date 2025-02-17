// Routes/continentPreferenceRoutes.js
const express = require("express");
const countryPreferenceController = require("../Controllers/countryPreferenceController");
const {
  createCountryPreference,
  getCountryPreferences,
  updateCountryPreference,
  deleteCountryPreference,
} = countryPreferenceController;

const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCountryPreference);
router.get("/", authMiddleware, getCountryPreferences);
router.put("/:id", authMiddleware, updateCountryPreference);
router.delete("/:id", authMiddleware, deleteCountryPreference);

module.exports = router;
