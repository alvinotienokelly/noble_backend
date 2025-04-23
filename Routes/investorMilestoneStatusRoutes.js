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
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_INVESTOR_MILESTONE_STATUS"),
  createInvestorMilestoneStatus
);
router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_INVESTOR_MILESTONE_STATUSES"),

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
  checkPermission("UPDATE_INVESTOR_MILESTONE_STATUS"),

  updateInvestorMilestoneStatus
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_INVESTOR_MILESTONE_STATUS"),

  deleteInvestorMilestoneStatus
);
router.get(
  "/user/:user_id/deal/:deal_id",
  authMiddleware,
  getAllInvestorMilestoneStatusesByUserAndDeal
); // Add this line

module.exports = router;
