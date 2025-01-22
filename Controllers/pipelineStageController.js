// Controllers/pipelineStageController.js
const db = require("../Models");
const PipelineStage = db.pipeline_stages;

// Create a new pipeline stage
const createPipelineStage = async (req, res) => {
  try {
    const { name, pipeline_id } = req.body;

    const pipelineStage = await PipelineStage.create({ name, pipeline_id });

    res.status(201).json({ status: true, pipelineStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all pipeline stages
const getAllPipelineStages = async (req, res) => {
  try {
    const pipelineStages = await PipelineStage.findAll();
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
      return res.status(404).json({ status: false, message: "Pipeline stage not found." });
    }
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
      return res.status(404).json({ status: false, message: "Pipeline stage not found." });
    }
    await pipelineStage.update(req.body);
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
      return res.status(404).json({ status: false, message: "Pipeline stage not found." });
    }
    await pipelineStage.destroy();
    res.status(200).json({ status: true, message: "Pipeline stage deleted successfully." });
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
};