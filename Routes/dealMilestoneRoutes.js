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

const router = express.Router();

router.post("/", authMiddleware, createDealMilestone);
router.get("/", authMiddleware, getAllDealMilestones);
router.get("/:id", authMiddleware, getDealMilestoneById);
router.put("/:id", authMiddleware, updateDealMilestone);
router.delete("/:id", authMiddleware, deleteDealMilestone);

module.exports = router;