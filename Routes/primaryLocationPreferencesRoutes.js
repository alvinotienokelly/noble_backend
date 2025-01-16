// Routes/primaryLocationPreferencesRoutes.js
const express = require("express");
const primaryLocationPreferencesController = require("../Controllers/primaryLocationPreferencesController");
const { createPrimaryLocationPreference, getPrimaryLocationPreferences, updatePrimaryLocationPreference, deletePrimaryLocationPreference } = primaryLocationPreferencesController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPrimaryLocationPreference);
router.get("/", authMiddleware, getPrimaryLocationPreferences);
router.put("/:id", authMiddleware, updatePrimaryLocationPreference);
router.delete("/:id", authMiddleware, deletePrimaryLocationPreference);

module.exports = router;