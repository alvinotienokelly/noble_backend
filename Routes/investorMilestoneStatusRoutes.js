// Routes/investorMilestoneStatusRoutes.js
const express = require("express");
const investorMilestoneStatusController = require("../Controllers/investorMilestoneStatusController");
const {
  createInvestorMilestoneStatus,
  getAllInvestorMilestoneStatuses,
  getInvestorMilestoneStatusById,
  updateInvestorMilestoneStatus,
  deleteInvestorMilestoneStatus,
  getAllInvestorMilestoneStatusesByUserAndDeal,
  getAllInvestorMilestoneStatusesByUser,
} = investorMilestoneStatusController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvestorMilestoneStatus);
router.get("/", authMiddleware, getAllInvestorMilestoneStatuses);
router.get("/:id", authMiddleware, getInvestorMilestoneStatusById);
router.put("/:id", authMiddleware, updateInvestorMilestoneStatus);
router.delete("/:id", authMiddleware, deleteInvestorMilestoneStatus);
router.get(
  "/user/:user_id/deal/:deal_id",
  authMiddleware,
  getAllInvestorMilestoneStatusesByUserAndDeal
); // Add this line

router.get(
  "/user",
  authMiddleware,
  getAllInvestorMilestoneStatusesByUser
); // Add this line

module.exports = router;
