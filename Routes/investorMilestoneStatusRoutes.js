// Routes/investorMilestoneStatusRoutes.js
const express = require("express");
const investorMilestoneStatusController = require("../Controllers/investorMilestoneStatusController");
const {
  createInvestorMilestoneStatus,
  getAllInvestorMilestoneStatuses,
  getInvestorMilestoneStatusById,
  updateInvestorMilestoneStatus,
  markInvestorMilestoneStatusAsCompleted, // Add this line
  deleteInvestorMilestoneStatus,
  getAllInvestorMilestoneStatusesByUserAndDeal,
  getAllInvestorMilestoneStatusesByUser,
  markInvestorMilestoneStatusAsPending,
} = investorMilestoneStatusController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_INVESTOR_MILESTONE_STATUS", "EDIT_DEAL"]),
  createInvestorMilestoneStatus
);
router.get(
  "/",
  authMiddleware,
  checkPermissions(["VIEW_ALL_INVESTOR_MILESTONE_STATUSES", "EDIT_DEAL"]),

  getAllInvestorMilestoneStatuses
);
router.put(
  "/:id/complete",
  authMiddleware,
  markInvestorMilestoneStatusAsCompleted
); // Add this line
router.put(
  "/:id/pending",
  authMiddleware,
  markInvestorMilestoneStatusAsPending
); // Add this line

router.get("/user", authMiddleware, getAllInvestorMilestoneStatusesByUser); // Add this line

router.get("/:id", authMiddleware, getInvestorMilestoneStatusById);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_INVESTOR_MILESTONE_STATUS"]),

  updateInvestorMilestoneStatus
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_INVESTOR_MILESTONE_STATUS"]),

  deleteInvestorMilestoneStatus
);
router.get(
  "/user/:user_id/deal/:deal_id",
  authMiddleware,
  getAllInvestorMilestoneStatusesByUserAndDeal
); // Add this line

module.exports = router;
