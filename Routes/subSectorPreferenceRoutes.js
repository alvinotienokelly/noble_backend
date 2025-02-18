// Routes/subSectorPreferenceRoutes.js
const express = require("express");
const subSectorPreferenceController = require("../Controllers/subSectorPreferenceController");
const {
  createSubSectorPreference,
  getSubSectorPreferences,
  bulkCreateSubSectorPreferences, // Add this line
  updateSubSectorPreference,
  deleteSubSectorPreference,
} = subSectorPreferenceController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSubSectorPreference);
router.post("/bulk", authMiddleware, bulkCreateSubSectorPreferences); // Add this line
router.get("/", authMiddleware, getSubSectorPreferences);
router.put("/:id", authMiddleware, updateSubSectorPreference);
router.delete("/:id", authMiddleware, deleteSubSectorPreference);

module.exports = router;
