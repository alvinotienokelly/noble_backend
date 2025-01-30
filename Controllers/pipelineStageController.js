// Controllers/pipelineStageController.js
const db = require("../Models");
const PipelineStage = db.pipeline_stages;
const Pipeline = db.pipelines;
const { createAuditLog } = require("./auditLogService");

// Create a new pipeline stage
const createPipelineStage = async (req, res) => {
  try {
    const { name, pipeline_id } = req.body;

    const pipelineStage = await PipelineStage.create({ name, pipeline_id });

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE_PIPELINE_STAGE",
      ip_address: req.ip,
      description: `Pipeline stage ${pipelineStage.name} created.`,
    });
    res.status(201).json({ status: true, pipelineStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get pipeline stages by pipeline ID
const getPipelineStagesByPipelineId = async (req, res) => {
  try {
    const { pipeline_id } = req.params;
    const pipelineStages = await PipelineStage.findAll({
      where: { pipeline_id },
      include: [{ model: Pipeline, as: "pipeline" }],
    });
    if (!pipelineStages || pipelineStages.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No pipeline stages found for this pipeline.",
      });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "GET_PIPELINE_STAGES_BY_PIPELINE_ID",
      ip_address: req.ip,
      description: `Fetched pipeline stages for pipeline ID ${pipeline_id}.`,
    });
    res.status(200).json({ status: true, pipelineStages });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all pipeline stages
const getAllPipelineStages = async (req, res) => {
  try {
    const pipelineStages = await PipelineStage.findAll();
    await createAuditLog({
      userId: req.user.id,
      action: "GET_ALL_PIPELINE_STAGES",
      ip_address: req.ip,
      description: "Fetched all pipeline stages.",
    });
    res.status(200).json({ status: true, pipelineStages });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a pipeline stage by ID
const getPipelineStageById = async (req, res) => {
  try {
    const pipelineStage = await PipelineStage.findByPk(req.params.id);
    if (!pipelineStage) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline stage not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "GET_PIPELINE_STAGE_BY_ID",
      ip_address: req.ip,
      description: `Fetched pipeline stage with ID ${req.params.id}.`,
    });
    res.status(200).json({ status: true, pipelineStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a pipeline stage
const updatePipelineStage = async (req, res) => {
  try {
    const pipelineStage = await PipelineStage.findByPk(req.params.id);
    if (!pipelineStage) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline stage not found." });
    }
    await pipelineStage.update(req.body);
    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_PIPELINE_STAGE",
      ip_address: req.ip,
      description: `Updated pipeline stage with ID ${req.params.id}.`,
    });
    res.status(200).json({ status: true, pipelineStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a pipeline stage
const deletePipelineStage = async (req, res) => {
  try {
    const pipelineStage = await PipelineStage.findByPk(req.params.id);
    if (!pipelineStage) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline stage not found." });
    }
    await pipelineStage.destroy();
    res
      .status(200)
      .json({ status: true, message: "Pipeline stage deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createPipelineStage,
  getAllPipelineStages,
  getPipelineStageById,
  updatePipelineStage,
  deletePipelineStage,
  getPipelineStagesByPipelineId,
};
