// Routes/subSectorPreferenceRoutes.js
const express = require("express");
const subSectorPreferenceController = require("../Controllers/subSectorPreferenceController");
const {
  createSubSectorPreference,
  getSubSectorPreferences,
  updateSubSectorPreference,
  deleteSubSectorPreference,
} = subSectorPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSubSectorPreference);
router.get("/", authMiddleware, getSubSectorPreferences);
router.put("/:id", authMiddleware, updateSubSectorPreference);
router.delete("/:id", authMiddleware, deleteSubSectorPreference);

module.exports = router;
