// Routes/pipelineStageRoutes.js
const express = require("express");
const pipelineStageController = require("../Controllers/pipelineStageController");
const {
  createPipelineStage,
  getAllPipelineStages,
  getPipelineStageById,
  updatePipelineStage,
  deletePipelineStage,
  getPipelineStagesByPipelineId,
} = pipelineStageController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_PIPELINE_STAGE"),
  createPipelineStage
);
router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_PIPELINE_STAGES"),

  getAllPipelineStages
);
router.get("/:id", authMiddleware, getPipelineStageById);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_PIPELINE_STAGE"),

  updatePipelineStage
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_PIPELINE_STAGE"),

  deletePipelineStage
);
router.get(
  "/pipeline/:pipeline_id",
  authMiddleware,
  getPipelineStagesByPipelineId
);

module.exports = router;
