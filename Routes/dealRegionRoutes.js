// Routes/dealRegionRoutes.js
const express = require("express");
const dealRegionController = require("../Controllers/dealRegionController");
const { addRegionToDeal, getRegionsForDeal, removeRegionFromDeal } =
  dealRegionController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermissions("ADD_REGION_TO_DEAL", "EDIT_DEAL"),

  addRegionToDeal
);
router.get(
  "/:deal_id/regions",
  authMiddleware,
  checkPermissions(["VIEW_REGIONS_FOR_DEAL", "EDIT_DEAL"]),

  getRegionsForDeal
);
router.delete(
  "/remove",
  authMiddleware,
  checkPermissions(["REMOVE_REGION_FROM_DEAL", "EDIT_DEAL"]),

  removeRegionFromDeal
);

module.exports = router;
