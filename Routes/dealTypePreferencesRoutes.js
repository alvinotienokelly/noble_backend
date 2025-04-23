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
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_DEAL_TYPE_PREFERENCE"),
  createDealTypePreference
);
router.get("/", authMiddleware, getDealTypePreferences);
router.get("/unique", authMiddleware, getUniqueDealTypePreferences); // Add this line
router.post(
  "/multiple",
  authMiddleware,
  checkPermission("CREATE_DEAL_TYPE_PREFERENCE"),

  createMultipleDealTypePreferences
); // Add this line
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_DEAL_TYPE_PREFERENCE"),
  updateDealTypePreference
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_DEAL_TYPE_PREFERENCE"),

  deleteDealTypePreference
);

module.exports = router;
