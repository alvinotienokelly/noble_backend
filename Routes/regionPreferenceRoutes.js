// Routes/regionPreferenceRoutes.js
const express = require("express");
const regionPreferenceController = require("../Controllers/regionPreferenceController");
const {
  createRegionPreference,
  getRegionPreferences,
  updateRegionPreference,
  deleteRegionPreference,
} = regionPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRegionPreference);
router.get("/", authMiddleware, getRegionPreferences);
router.put("/:id", authMiddleware, updateRegionPreference);
router.delete("/:id", authMiddleware, deleteRegionPreference);

module.exports = router;
