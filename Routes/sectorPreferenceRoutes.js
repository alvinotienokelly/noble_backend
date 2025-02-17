// Routes/sectorPreferenceRoutes.js
const express = require("express");
const sectorPreferenceController = require("../Controllers/sectorPreferenceController");
const {
  createSectorPreference,
  getSectorPreferences,
  updateSectorPreference,
  deleteSectorPreference,
} = sectorPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSectorPreference);
router.get("/", authMiddleware, getSectorPreferences);
router.put("/:id", authMiddleware, updateSectorPreference);
router.delete("/:id", authMiddleware, deleteSectorPreference);

module.exports = router;
