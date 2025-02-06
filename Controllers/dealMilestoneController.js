// Controllers/dealMilestoneController.js
const db = require("../Models");
const DealMilestone = db.deal_milestones;

// Create a new deal milestone
const createDealMilestone = async (req, res) => {
  try {
    const { name, description } = req.body;
    const milestone = await DealMilestone.create({ name, description });
    res.status(201).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all deal milestones
const getAllDealMilestones = async (req, res) => {
  try {
    const milestones = await DealMilestone.findAll();
    res.status(200).json({ status: true, milestones });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a deal milestone by ID
const getDealMilestoneById = async (req, res) => {
  try {
    const milestone = await DealMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone not found." });
    }
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a deal milestone
const updateDealMilestone = async (req, res) => {
  try {
    const { name, description } = req.body;
    const milestone = await DealMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone not found." });
    }
    await milestone.update({ name, description });
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a deal milestone
const deleteDealMilestone = async (req, res) => {
  try {
    const milestone = await DealMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone not found." });
    }
    await milestone.destroy();
    res
      .status(200)
      .json({ status: true, message: "Milestone deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDealMilestone,
  getAllDealMilestones,
  getDealMilestoneById,
  updateDealMilestone,
  deleteDealMilestone,
};
