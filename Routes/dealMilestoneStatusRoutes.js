// Routes/dealMilestoneStatusRoutes.js
const express = require("express");
const dealMilestoneStatusController = require("../Controllers/dealMilestoneStatusController");
const {
  createDealMilestoneStatus,
  getAllDealMilestoneStatuses,
  getDealMilestoneStatusById,
  updateDealMilestoneStatus,
  deleteDealMilestoneStatus,
} = dealMilestoneStatusController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDealMilestoneStatus);
router.get("/", authMiddleware, getAllDealMilestoneStatuses);
router.get("/:id", authMiddleware, getDealMilestoneStatusById);
router.put("/:id", authMiddleware, updateDealMilestoneStatus);
router.delete("/:id", authMiddleware, deleteDealMilestoneStatus);

module.exports = router;