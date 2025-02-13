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

const router = express.Router();

router.post("/", authMiddleware, createInvestorMilestoneStatus);
router.get("/", authMiddleware, getAllInvestorMilestoneStatuses);
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
router.put("/:id", authMiddleware, updateInvestorMilestoneStatus);
router.delete("/:id", authMiddleware, deleteInvestorMilestoneStatus);
router.get(
  "/user/:user_id/deal/:deal_id",
  authMiddleware,
  getAllInvestorMilestoneStatusesByUserAndDeal
); // Add this line

module.exports = router;
