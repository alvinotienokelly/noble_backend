// Routes/dealMilestoneRoutes.js
const express = require("express");
const dealMilestoneController = require("../Controllers/dealMilestoneController");
const {
  createDealMilestone,
  getAllDealMilestones,
  getDealMilestoneById,
  updateDealMilestone,
  deleteDealMilestone,
} = dealMilestoneController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_DEAL_MILESTONE", "EDIT_DEAL"]),

  createDealMilestone
);
router.get(
  "/",
  authMiddleware,
  checkPermissions(["VIEW_ALL_DEAL_MILESTONES", "EDIT_DEAL"]),

  getAllDealMilestones
);
router.get(
  "/:id",
  authMiddleware,
  checkPermissions(["VIEW_DEAL_MILESTONE_BY_ID", "EDIT_DEAL"]),

  getDealMilestoneById
);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_DEAL_MILESTONE", "EDIT_DEAL"]),

  updateDealMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_DEAL_MILESTONE", "EDIT_DEAL"]),

  deleteDealMilestone
);

module.exports = router;
