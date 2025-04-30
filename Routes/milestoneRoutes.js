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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_MILESTONE", "EDIT_DEAL"]),
  createMilestone
);
router.get(
  "/deal/:dealId",
  authMiddleware,
  checkPermissions(["VIEW_MILESTONE_BY_ID"]),

  getMilestonesByDealId
);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_MILESTONE"]),

  updateMilestone
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_MILESTONE"]),
  deleteMilestone
);
router.get("/filter/milestones", authMiddleware, filterMilestones);
router.get("/user-milestones/milestones", authMiddleware, getMilestonesForUser);

module.exports = router;
