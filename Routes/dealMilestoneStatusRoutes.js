// Routes/dealMilestoneStatusRoutes.js
const express = require("express");
const dealMilestoneStatusController = require("../Controllers/dealMilestoneStatusController");
const {
  createDealMilestoneStatus,
  getAllDealMilestoneStatuses,
  getDealMilestoneStatusById,
  updateDealMilestoneStatus,
  deleteDealMilestoneStatus,
} = dealMilestoneStatusController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_DEAL_MILESTONE_STATUS"),

  createDealMilestoneStatus
);
router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_DEAL_MILESTONE_STATUSES"),

  getAllDealMilestoneStatuses
);
router.get(
  "/:id",
  authMiddleware,
  checkPermission("VIEW_DEAL_MILESTONE_STATUS_BY_ID"),
  getDealMilestoneStatusById
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_DEAL_MILESTONE_STATUS"),

  updateDealMilestoneStatus
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_DEAL_MILESTONE_STATUS"),

  deleteDealMilestoneStatus
);

module.exports = router;
