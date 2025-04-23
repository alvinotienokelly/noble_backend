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
  markAllDealsAsOpen,
  markDealAsOpen,
} = dealController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");
const fileUpload = require("../Middlewares/fileUpload");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post("/", authMiddleware, checkPermission("CREATE_DEAL"), createDeal);
router.get("/", authMiddleware, getAllDeals);
router.put(
  "/deals/mark-all-open",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ACTIVE"),
  markAllDealsAsOpen
);
router.put("/:id/update-stage", authMiddleware, updateDealStage); // Add this line
router.get("/filter-by-location", authMiddleware, filterDealsByLocation); // Add this line
router.get("/getTargetCompanyDeals", authMiddleware, getTargetCompanyDeals);
router.get("/accepted-deals", authMiddleware, getAcceptedDealsForInvestor); // Add this line
router.put(
  "/:id/mark-active",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ACTIVE"),

  markDealAsActive
); // Add this line
router.put(
  "/:id/mark-pending",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ACTIVE"),

  markDealAsPending
); // Add this line
router.put(
  "/:id/mark-open",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ACTIVE"),

  markDealAsOpen
); // Add this line
router.put(
  "/:id/mark-archived",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ARCHIVED"),

  markDealAsArchived
); // Add this line
router.put(
  "/:id/on-hold",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_ON_HOLD"),

  markDealOnhold
); // Add this line
router.put(
  "/:id/mark-closed",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_CLOSED"),
  markDealClosed
); // Add this line
router.put(
  "/:id/mark-closed-opened",
  authMiddleware,
  checkPermission("MARK_DEAL_AS_CLOSED_AND_REOPENED"),

  markDealClosedAndOpened
); // Add this line
router.get("/:id", authMiddleware, getDealById);
router.put(
  "/:id",
  authMiddleware,
  checkAdmin,
  checkPermission("UPDATE_DEAL"),

  updateDeal
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_DEAL"),

  deleteDeal
);
router.get("/user/preferences", authMiddleware, getDealsByUserPreferences);
router.get("/filter/deals", authMiddleware, filterDeals);
router.get(
  "/:deal_id/stage/:deal_stage_id",
  authMiddleware,
  getMilestonesAndTasksByDealAndStage
); // Add this line

module.exports = router;
