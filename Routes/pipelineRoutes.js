// Routes/pipelineRoutes.js
const express = require("express");
const pipelineController = require("../Controllers/pipelineController");
const { createPipeline, getAllPipelines, getPipelineById, updatePipeline, deletePipeline } = pipelineController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPipeline);
router.get("/", authMiddleware, getAllPipelines);
router.get("/:id", authMiddleware, getPipelineById);
router.put("/:id", authMiddleware, updatePipeline);
router.delete("/:id", authMiddleware, deletePipeline);

module.exports = router;