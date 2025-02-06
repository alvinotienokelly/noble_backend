// Controllers/investorMilestoneController.js
const db = require("../Models");
const InvestorMilestone = db.investor_milestones;

// Create a new investor milestone
const createInvestorMilestone = async (req, res) => {
  try {
    const { name, description } = req.body;
    const milestone = await InvestorMilestone.create({ name, description });
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all investor milestones
const getAllInvestorMilestones = async (req, res) => {
  try {
    const milestones = await InvestorMilestone.findAll();
    res.status(200).json({ status: true, milestones });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get an investor milestone by ID
const getInvestorMilestoneById = async (req, res) => {
  try {
    const milestone = await InvestorMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res.status(404).json({ status: false, message: "Milestone not found." });
    }
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an investor milestone
const updateInvestorMilestone = async (req, res) => {
  try {
    const { name, description } = req.body;
    const milestone = await InvestorMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res.status(404).json({ status: false, message: "Milestone not found." });
    }
    await milestone.update({ name, description });
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete an investor milestone
const deleteInvestorMilestone = async (req, res) => {
  try {
    const milestone = await InvestorMilestone.findByPk(req.params.id);
    if (!milestone) {
      return res.status(404).json({ status: false, message: "Milestone not found." });
    }
    await milestone.destroy();
    res.status(200).json({ status: true, message: "Milestone deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createInvestorMilestone,
  getAllInvestorMilestones,
  getInvestorMilestoneById,
  updateInvestorMilestone,
  deleteInvestorMilestone,
};