// Routes/investorMilestoneStatusRoutes.js
const express = require("express");
const investorMilestoneStatusController = require("../Controllers/investorMilestoneStatusController");
const {
  createInvestorMilestoneStatus,
  getAllInvestorMilestoneStatuses,
  getInvestorMilestoneStatusById,
  updateInvestorMilestoneStatus,
  deleteInvestorMilestoneStatus,
} = investorMilestoneStatusController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvestorMilestoneStatus);
router.get("/", authMiddleware, getAllInvestorMilestoneStatuses);
router.get("/:id", authMiddleware, getInvestorMilestoneStatusById);
router.put("/:id", authMiddleware, updateInvestorMilestoneStatus);
router.delete("/:id", authMiddleware, deleteInvestorMilestoneStatus);

module.exports = router;