// Routes/regionPreferenceRoutes.js
const express = require("express");
const regionPreferenceController = require("../Controllers/regionPreferenceController");
const {
  createRegionPreference,
  getRegionPreferences,
  updateRegionPreference,
  bulkCreateRegionPreferences, // Add this line
  deleteRegionPreference,
} = regionPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRegionPreference);
router.post("/bulk", authMiddleware, bulkCreateRegionPreferences); // Add this line
router.get("/", authMiddleware, getRegionPreferences);
router.put("/:id", authMiddleware, updateRegionPreference);
router.delete("/:id", authMiddleware, deleteRegionPreference);

module.exports = router;
