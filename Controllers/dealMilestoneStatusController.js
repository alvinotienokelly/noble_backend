// Controllers/dealMilestoneStatusController.js
const db = require("../Models");
const DealMilestoneStatus = db.deal_milestone_statuses;
const DealMilestone = db.deal_milestones;
const Deal = db.deals;
const { createNotification } = require("./notificationController");
const { createAuditLog } = require("./auditLogService");

// Create a new deal milestone status
const createDealMilestoneStatus = async (req, res) => {
  try {
    const { deal_milestone_id, deal_id, status } = req.body;
    const milestoneStatus = await DealMilestoneStatus.create({
      deal_milestone_id,
      deal_id,
      status,
    });
    await createNotification(
      req.user.id,
      `New milestone status created for deal: ${deal_id}`,
      "deal_milestone_status"
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Create_Deal_Milestone_Status",
      details: `Milestone status created for deal: ${deal_id}`,
      ip_address: req.ip,
    });

    res.status(201).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all deal milestone statuses
const getAllDealMilestoneStatuses = async (req, res) => {
  try {
    const milestoneStatuses = await DealMilestoneStatus.findAll({
      include: [
        {
          model: DealMilestone,
          as: "milestone",
          attributes: ["milestone_id", "name", "description"],
        },
        {
          model: Deal,
          as: "deal",
          attributes: ["deal_id", "title", "description"],
        },
      ],
    });
    res.status(200).json({ status: true, milestoneStatuses });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a deal milestone status by ID
const getDealMilestoneStatusById = async (req, res) => {
  try {
    const milestoneStatus = await DealMilestoneStatus.findByPk(req.params.id, {
      include: [
        {
          model: DealMilestone,
          as: "milestone",
          attributes: ["milestone_id", "name", "description"],
        },
        {
          model: Deal,
          as: "deal",
          attributes: ["deal_id", "title", "description"],
        },
      ],
    });
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a deal milestone status
const updateDealMilestoneStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const milestoneStatus = await DealMilestoneStatus.findByPk(req.params.id);
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "Update_Deal_Milestone_Status",
      details: `Milestone status updated for deal: ${milestoneStatus.deal_id}`,
      ip_address: req.ip,
    });
    await createNotification(
      req.user.id,
      `Milestone status updated for deal: ${milestoneStatus.deal_id}`,
      "deal_milestone_status"
    );
    await milestoneStatus.update({ status });
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a deal milestone status
const deleteDealMilestoneStatus = async (req, res) => {
  try {
    const milestoneStatus = await DealMilestoneStatus.findByPk(req.params.id);
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await milestoneStatus.destroy();
    await createAuditLog({
      userId: req.user.id,
      action: "Delete_Deal_Milestone_Status",
      details: `Milestone status deleted for deal: ${milestoneStatus.deal_id}`,
      ip_address: req.ip,
    });
    await createNotification(
      req.user.id,
      `Milestone status deleted for deal: ${milestoneStatus.deal_id}`,
      "deal_milestone_status"
    );
    res.status(200).json({
      status: true,
      message: "Milestone status deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDealMilestoneStatus,
  getAllDealMilestoneStatuses,
  getDealMilestoneStatusById,
  updateDealMilestoneStatus,
  deleteDealMilestoneStatus,
};
