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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_DEAL", "EDIT_DEAL", "UPDATE_DEAL"]),
  createDeal
);
router.get("/", authMiddleware, getAllDeals);
router.put(
  "/deals/mark-all-open",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ACTIVE", "EDIT_DEAL", "UPDATE_DEAL"]),
  markAllDealsAsOpen
);
router.put("/:id/update-stage", authMiddleware, updateDealStage); // Add this line
router.get("/filter-by-location", authMiddleware, filterDealsByLocation); // Add this line
router.get("/getTargetCompanyDeals", authMiddleware, getTargetCompanyDeals);
router.get("/accepted-deals", authMiddleware, getAcceptedDealsForInvestor); // Add this line
router.put(
  "/:id/mark-active",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ACTIVE", "EDIT_DEAL", "UPDATE_DEAL"]),

  markDealAsActive
); // Add this line
router.put(
  "/:id/mark-pending",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ACTIVE", "EDIT_DEAL", "UPDATE_DEAL"]),

  markDealAsPending
); // Add this line
router.put(
  "/:id/mark-open",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ACTIVE", "EDIT_DEAL", "UPDATE_DEAL"]),

  markDealAsOpen
); // Add this line
router.put(
  "/:id/mark-archived",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ARCHIVED", "EDIT_DEAL", "UPDATE_DEAL"]),

  markDealAsArchived
); // Add this line
router.put(
  "/:id/on-hold",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_ON_HOLD", "EDIT_DEAL", "UPDATE_DEAL"]),

  markDealOnhold
); // Add this line
router.put(
  "/:id/mark-closed",
  authMiddleware,
  checkPermissions(["MARK_DEAL_AS_CLOSED", "EDIT_DEAL"]),
  markDealClosed
); // Add this line
router.put(
  "/:id/mark-closed-opened",
  authMiddleware,
  checkPermissions([
    "MARK_DEAL_AS_CLOSED_AND_REOPENED",
    "EDIT_DEAL",
    "UPDATE_DEAL",
  ]),

  markDealClosedAndOpened
); // Add this line
router.get("/:id", authMiddleware, getDealById);
router.put(
  "/:id",
  authMiddleware,
  checkAdmin,
  checkPermissions(["UPDATE_DEAL", "EDIT_DEAL", "UPDATE_DEAL"]),

  updateDeal
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_DEAL", "EDIT_DEAL", "UPDATE_DEAL", "UPDATE_DEAL"]),

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
