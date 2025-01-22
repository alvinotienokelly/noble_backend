// Routes/stageCardRoutes.js
const express = require("express");
const stageCardController = require("../Controllers/stageCardController");
const { createStageCard, getAllStageCards, getStageCardById, updateStageCard, deleteStageCard } = stageCardController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createStageCard);
router.get("/", authMiddleware, getAllStageCards);
router.get("/:id", authMiddleware, getStageCardById);
router.put("/:id", authMiddleware, updateStageCard);
router.delete("/:id", authMiddleware, deleteStageCard);

module.exports = router;