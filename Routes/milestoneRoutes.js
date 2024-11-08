// Routes/milestoneRoutes.js
const express = require("express");
const milestoneController = require("../Controllers/milestoneController");
const { createMilestone, getMilestonesByDealId, updateMilestone, deleteMilestone, filterMilestones } = milestoneController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createMilestone);
router.get("/deal/:dealId", authMiddleware, getMilestonesByDealId);
router.put("/:id", authMiddleware, updateMilestone);
router.delete("/:id", authMiddleware, deleteMilestone);
router.get("/filter/milestones", authMiddleware, filterMilestones);

module.exports = router;