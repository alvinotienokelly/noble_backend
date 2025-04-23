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
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_INVESTOR_MILESTONE"),

  createInvestorMilestone
);
router.get("/", authMiddleware, getAllInvestorMilestones);
router.get("/:id", authMiddleware, getInvestorMilestoneById);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_INVESTOR_MILESTONE"),

  updateInvestorMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_INVESTOR_MILESTONE"),

  deleteInvestorMilestone
);

module.exports = router;
