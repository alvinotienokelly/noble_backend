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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_DEAL_TYPE_PREFERENCE"]),
  createDealTypePreference
);
router.get("/", authMiddleware, getDealTypePreferences);
router.get("/unique", authMiddleware, getUniqueDealTypePreferences); // Add this line
router.post(
  "/multiple",
  authMiddleware,
  checkPermissions(["CREATE_DEAL_TYPE_PREFERENCE"]),

  createMultipleDealTypePreferences
); // Add this line
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_DEAL_TYPE_PREFERENCE"]),
  updateDealTypePreference
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_DEAL_TYPE_PREFERENCE"]),

  deleteDealTypePreference
);

module.exports = router;
