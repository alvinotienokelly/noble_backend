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
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_DEAL_MILESTONE"),

  createDealMilestone
);
router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_DEAL_MILESTONES"),

  getAllDealMilestones
);
router.get(
  "/:id",
  authMiddleware,
  checkPermission("VIEW_DEAL_MILESTONE_BY_ID"),

  getDealMilestoneById
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_DEAL_MILESTONE"),

  updateDealMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_DEAL_MILESTONE"),

  deleteDealMilestone
);

module.exports = router;
