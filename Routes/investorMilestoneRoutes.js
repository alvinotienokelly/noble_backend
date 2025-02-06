// Routes/investorMilestoneRoutes.js
const express = require("express");
const investorMilestoneController = require("../Controllers/investorMilestoneController");
const {
  createInvestorMilestone,
  getAllInvestorMilestones,
  getInvestorMilestoneById,
  updateInvestorMilestone,
  deleteInvestorMilestone,
} = investorMilestoneController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvestorMilestone);
router.get("/", authMiddleware, getAllInvestorMilestones);
router.get("/:id", authMiddleware, getInvestorMilestoneById);
router.put("/:id", authMiddleware, updateInvestorMilestone);
router.delete("/:id", authMiddleware, deleteInvestorMilestone);

module.exports = router;