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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_DEAL_MILESTONE_STATUS", "EDIT_DEAL"]),

  createDealMilestoneStatus
);
router.get(
  "/",
  authMiddleware,
  checkPermissions(["VIEW_ALL_DEAL_MILESTONE_STATUSES", "EDIT_DEAL"]),

  getAllDealMilestoneStatuses
);
router.get(
  "/:id",
  authMiddleware,
  checkPermissions(["VIEW_DEAL_MILESTONE_STATUS_BY_ID", "EDIT_DEAL"]),
  getDealMilestoneStatusById
);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions("UPDATE_DEAL_MILESTONE_STATUS", "EDIT_DEAL"),

  updateDealMilestoneStatus
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_DEAL_MILESTONE_STATUS", "EDIT_DEAL"]),

  deleteDealMilestoneStatus
);

module.exports = router;
