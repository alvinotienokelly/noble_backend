// Routes/investorDealStagesRoutes.js
const express = require("express");
const {
  updateInvestorDealStage,
  addInvestorToDealStage,
} = require("../Controllers/investorDealStagesController");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.put(
  "/update-stage",
  checkPermission("UPDATE_INVESTOR_DEAL_STAGE"),

  updateInvestorDealStage
);
router.post(
  "/add-to-stage",
  checkPermission("ADD_INVESTOR_TO_DEAL_STAGE"),

  addInvestorToDealStage
);

module.exports = router;
