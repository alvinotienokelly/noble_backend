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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_INVESTOR_MILESTONE"]),

  createInvestorMilestone
);
router.get("/", authMiddleware, getAllInvestorMilestones);
router.get("/:id", authMiddleware, getInvestorMilestoneById);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_INVESTOR_MILESTONE"]),

  updateInvestorMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_INVESTOR_MILESTONE"]),

  deleteInvestorMilestone
);

module.exports = router;
