const express = require("express");
const dealController = require("../Controllers/dealController");
const {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getDealsByUserPreferences,
  getTargetCompanyDeals,
  getMilestonesAndTasksByDealAndStage, // Add this line
  filterDeals,
  getAcceptedDealsForInvestor,
  markDealAsActive,
  markDealAsPending,
  markDealOnhold,
  markDealClosed,
  markDealClosedAndOpened,
  markDealAsArchived, // Add this line
  filterDealsByLocation,
  updateDealStage,
} = dealController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");
const fileUpload = require("../Middlewares/fileUpload");

const router = express.Router();

router.post("/", authMiddleware,fileUpload, createDeal);
router.get("/", authMiddleware, getAllDeals);
router.put("/:id/update-stage", authMiddleware, updateDealStage); // Add this line
router.get("/filter-by-location", authMiddleware, filterDealsByLocation); // Add this line
router.get("/getTargetCompanyDeals", authMiddleware, getTargetCompanyDeals);
router.get("/accepted-deals", authMiddleware, getAcceptedDealsForInvestor); // Add this line
router.put("/:id/mark-active", authMiddleware, markDealAsActive); // Add this line
router.put("/:id/mark-pending", authMiddleware, markDealAsPending); // Add this line
router.put("/:id/mark-archived", authMiddleware, markDealAsArchived); // Add this line
router.put("/:id/on-hold", authMiddleware, markDealOnhold); // Add this line
router.put("/:id/mark-closed", authMiddleware, markDealClosed); // Add this line
router.put("/:id/mark-closed-opened", authMiddleware, markDealClosedAndOpened); // Add this line
router.get("/:id", authMiddleware, getDealById);
router.put("/:id", authMiddleware, checkAdmin, updateDeal);
router.delete("/:id", authMiddleware, deleteDeal);
router.get("/user/preferences", authMiddleware, getDealsByUserPreferences);
router.get("/filter/deals", authMiddleware, filterDeals);
router.get(
  "/:deal_id/stage/:deal_stage_id",
  authMiddleware,
  getMilestonesAndTasksByDealAndStage
); // Add this line

module.exports = router;
