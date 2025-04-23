// Routes/dealRegionRoutes.js
const express = require("express");
const dealRegionController = require("../Controllers/dealRegionController");
const { addRegionToDeal, getRegionsForDeal, removeRegionFromDeal } =
  dealRegionController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermission("ADD_REGION_TO_DEAL"),

  addRegionToDeal
);
router.get(
  "/:deal_id/regions",
  authMiddleware,
  checkPermission("VIEW_REGIONS_FOR_DEAL"),

  getRegionsForDeal
);
router.delete(
  "/remove",
  authMiddleware,
  checkPermission("REMOVE_REGION_FROM_DEAL"),

  removeRegionFromDeal
);

module.exports = router;
