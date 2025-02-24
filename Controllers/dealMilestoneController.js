// Controllers/dealMilestoneController.js
const db = require("../Models");
const DealMilestone = db.deal_milestones;
const { createNotification } = require("./notificationController");
const { createAuditLog } = require("./auditLogService");

// Create a new deal milestone
const createDealMilestone = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { name, description } = req.body;
    const milestone = await DealMilestone.create({ name, description });
    await createNotification(
      user_id,
      `New milestone created: ${milestone.name}`,
      "deal_milestone"
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Create_Deal_Milestone",
      details: `Milestone created: ${milestone.name}`,
      ip_address: req.ip,
    });
    res.status(201).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all deal milestones
const getAllDealMilestones = async (req, res) => {
  try {
    const milestones = await DealMilestone.findAll();
    await createAuditLog({
      userId: req.user.id,
      action: "Get_All_Deal_Milestones",
      details: "Retrieved all deal milestones",
      ip_address: req.ip,
    });
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
    await createAuditLog({
      userId: req.user.id,
      action: "Get_Deal_Milestone_By_Id",
      details: `Retrieved milestone: ${milestone.name}`,
      ip_address: req.ip,
    });
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
    await createNotification(
      req.user.id,
      `Milestone updated: ${milestone.name}`,
      "deal_milestone"
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Update_Deal_Milestone",
      details: `Milestone updated: ${milestone.name}`,
      ip_address: req.ip,
    });
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
    await createNotification(
      req.user.id,
      `Milestone deleted: ${milestone.name}`,
      "deal_milestone"
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Delete_Deal_Milestone",
      details: `Milestone deleted: ${milestone.name}`,
      ip_address: req.ip,
    });
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
