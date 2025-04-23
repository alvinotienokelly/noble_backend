// Routes/milestoneRoutes.js
const express = require("express");
const milestoneController = require("../Controllers/milestoneController");
const {
  createMilestone,
  getMilestonesByDealId,
  updateMilestone,
  deleteMilestone,
  filterMilestones,
  getMilestonesForUser,
} = milestoneController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_MILESTONE"),
  createMilestone
);
router.get(
  "/deal/:dealId",
  authMiddleware,
  checkPermission("VIEW_MILESTONE_BY_ID"),

  getMilestonesByDealId
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_MILESTONE"),

  updateMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_MILESTONE"),
  deleteMilestone
);
router.get("/filter/milestones", authMiddleware, filterMilestones);
router.get("/user-milestones/milestones", authMiddleware, getMilestonesForUser);

module.exports = router;
