// Controllers/stageCardController.js
const db = require("../Models");
const StageCard = db.stage_cards;
const PipelineStage = db.pipeline_stages;
const User = db.users;

// Create a new stage card
const createStageCard = async (req, res) => {
  try {
    const { pipeline_stage_id, user_id } = req.body;

    const stageCard = await StageCard.create({ pipeline_stage_id, user_id });

    res.status(201).json({ status: true, stageCard });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all stage cards
const getAllStageCards = async (req, res) => {
  try {
    const stageCards = await StageCard.findAll();
    res.status(200).json({ status: true, stageCards });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a stage card by ID
const getStageCardById = async (req, res) => {
  try {
    const stageCard = await StageCard.findByPk(req.params.id, {
      include: [
        { model: PipelineStage, as: "pipelineStage" },
        { model: User, as: "user" },
      ],
    });
    if (!stageCard) {
      return res
        .status(404)
        .json({ status: false, message: "Stage card not found." });
    }
    res.status(200).json({ status: true, stageCard });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a stage card
const updateStageCard = async (req, res) => {
  try {
    const stageCard = await StageCard.findByPk(req.params.id);
    if (!stageCard) {
      return res
        .status(404)
        .json({ status: false, message: "Stage card not found." });
    }
    await stageCard.update(req.body);
    res.status(200).json({ status: true, stageCard });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a stage card
const deleteStageCard = async (req, res) => {
  try {
    const stageCard = await StageCard.findByPk(req.params.id);
    if (!stageCard) {
      return res
        .status(404)
        .json({ status: false, message: "Stage card not found." });
    }
    await stageCard.destroy();
    res
      .status(200)
      .json({ status: true, message: "Stage card deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createStageCard,
  getAllStageCards,
  getStageCardById,
  updateStageCard,
  deleteStageCard,
};
