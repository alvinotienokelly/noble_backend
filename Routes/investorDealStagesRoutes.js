// Routes/investorDealStagesRoutes.js
const express = require("express");
const {
  updateInvestorDealStage,
  addInvestorToDealStage,
} = require("../Controllers/investorDealStagesController");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.put(
  "/update-stage",
  checkPermissions(["UPDATE_INVESTOR_DEAL_STAGE"]),

  updateInvestorDealStage
);
router.post(
  "/add-to-stage",
  checkPermissions(["ADD_INVESTOR_TO_DEAL_STAGE"]),

  addInvestorToDealStage
);

module.exports = router;
