// Routes/pipelineStageRoutes.js
const express = require("express");
const pipelineStageController = require("../Controllers/pipelineStageController");
const { createPipelineStage, getAllPipelineStages, getPipelineStageById, updatePipelineStage, deletePipelineStage } = pipelineStageController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPipelineStage);
router.get("/", authMiddleware, getAllPipelineStages);
router.get("/:id", authMiddleware, getPipelineStageById);
router.put("/:id", authMiddleware, updatePipelineStage);
router.delete("/:id", authMiddleware, deletePipelineStage);

module.exports = router;