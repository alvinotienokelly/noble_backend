// Controllers/investorMilestoneStatusController.js
const db = require("../Models");
const InvestorMilestoneStatus = db.investor_milestone_statuses;

// Create a new investor milestone status
const createInvestorMilestoneStatus = async (req, res) => {
  try {
    const { investor_milestone_id, user_id, deal_id, status } = req.body;
    const milestoneStatus = await InvestorMilestoneStatus.create({
      investor_milestone_id,
      user_id,
      deal_id,
      status,
    });
    res.status(201).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all investor milestone statuses
const getAllInvestorMilestoneStatuses = async (req, res) => {
  try {
    const milestoneStatuses = await InvestorMilestoneStatus.findAll();
    res.status(200).json({ status: true, milestoneStatuses });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get an investor milestone status by ID
const getInvestorMilestoneStatusById = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(req.params.id);
    if (!milestoneStatus) {
      return res.status(404).json({ status: false, message: "Milestone status not found." });
    }
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an investor milestone status
const updateInvestorMilestoneStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(req.params.id);
    if (!milestoneStatus) {
      return res.status(404).json({ status: false, message: "Milestone status not found." });
    }
    await milestoneStatus.update({ status });
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete an investor milestone status
const deleteInvestorMilestoneStatus = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(req.params.id);
    if (!milestoneStatus) {
      return res.status(404).json({ status: false, message: "Milestone status not found." });
    }
    await milestoneStatus.destroy();
    res.status(200).json({ status: true, message: "Milestone status deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createInvestorMilestoneStatus,
  getAllInvestorMilestoneStatuses,
  getInvestorMilestoneStatusById,
  updateInvestorMilestoneStatus,
  deleteInvestorMilestoneStatus,
};