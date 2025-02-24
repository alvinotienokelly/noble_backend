// Controllers/investorMilestoneStatusController.js
const db = require("../Models");
const InvestorMilestoneStatus = db.investor_milestone_statuses;
const InvestorMilestone = db.investor_milestones;
const User = db.users;
const Deal = db.deals;
const { createNotification } = require("./notificationController");
const { createAuditLog } = require("./auditLogService");

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
    await createAuditLog({
      userId: req.user.id,
      action: `Created Investor Milestone Status`,
      details: `User created a new investor milestone status with ID ${milestoneStatus.id}`,
      ip_address: req.ip,
    });
    await createNotification(
      user_id,
      "Profile Updated",
      "Your profile has been updated."
    );
    res.status(201).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all investor milestone statuses by user_id and deal_id
const getAllInvestorMilestoneStatusesByUserAndDeal = async (req, res) => {
  try {
    const { user_id, deal_id } = req.params;

    const milestoneStatuses = await InvestorMilestoneStatus.findAll({
      where: {
        user_id,
        deal_id,
      },
      include: [
        {
          model: InvestorMilestone,
          as: "milestone",
          attributes: ["milestone_id", "name", "description"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Deal,
          as: "deal",
          attributes: ["deal_id", "title", "description"],
        },
      ],
    });

    if (!milestoneStatuses || milestoneStatuses.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No milestone statuses found for the specified criteria.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: `Fetched Investor Milestone Statuses`,
      details: `User fetched all investor milestone statuses for user_id ${user_id} and deal_id ${deal_id}`,
      ip_address: req.ip,
    });
    await createNotification(
      user_id,
      "Milestone Status Fetched",
      `Milestone statuses for user_id ${user_id} and deal_id ${deal_id} have been fetched.`
    );
    res.status(200).json({
      status: true,
      milestoneStatuses,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all investor milestone statuses by user_id and deal_id
const getAllInvestorMilestoneStatusesByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const milestoneStatuses = await InvestorMilestoneStatus.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: InvestorMilestone,
          as: "milestone",
          attributes: ["milestone_id", "name", "description"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Deal,
          as: "deal",
          attributes: ["deal_id", "project", "description"],
        },
      ],
    });

    if (!milestoneStatuses || milestoneStatuses.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No milestone statuses found for the specified criteria.",
      });
    }
    await createAuditLog({
      userId: req.user.id,
      action: `Fetched Investor Milestone Statuses`,
      details: `User fetched all investor milestone statuses for user_id ${user_id}`,
      ip_address: req.ip,
    });
    await createNotification(
      user_id,
      "Milestone Status Fetched",
      `Milestone statuses for user_id ${user_id} have been fetched.`
    );

    res.status(200).json({
      status: true,
      milestoneStatuses,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all investor milestone statuses
const getAllInvestorMilestoneStatuses = async (req, res) => {
  try {
    const milestoneStatuses = await InvestorMilestoneStatus.findAll();
    await createAuditLog({
      userId: req.user.id,
      action: `Fetched All Investor Milestone Statuses`,
      details: `User fetched all investor milestone statuses`,
      ip_address: req.ip,
    });
    await createNotification(
      req.user.id,
      "Milestone Statuses Fetched",
      "All milestone statuses have been fetched."
    );
    res.status(200).json({ status: true, milestoneStatuses });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get an investor milestone status by ID
const getInvestorMilestoneStatusById = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(
      req.params.id
    );
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: `Fetched Investor Milestone Status`,
      details: `User fetched investor milestone status with ID ${req.params.id}`,
      ip_address: req.ip,
    });
    await createNotification(
      milestoneStatus.user_id,
      "Milestone Status Fetched",
      `Milestone status with ID ${req.params.id} has been fetched.`
    );
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an investor milestone status
const updateInvestorMilestoneStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(
      req.params.id
    );
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: `Updated Investor Milestone Status`,
      details: `User updated investor milestone status with ID ${req.params.id} to status ${status}`,
      ip_address: req.ip,
    });
    await createNotification(
      milestoneStatus.user_id,
      "Milestone Status Updated",
      `Milestone status with ID ${req.params.id} has been updated to ${status}.`
    );
    await milestoneStatus.update({ status });
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Mark an investor milestone status as completed
const markInvestorMilestoneStatusAsCompleted = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(
      req.params.id
    );
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await milestoneStatus.update({ status: "Completed" });
    await createAuditLog({
      userId: req.user.id,
      action: `Marked Investor Milestone Status as Completed`,
      details: `User marked investor milestone status with ID ${req.params.id} as completed`,
      ip_address: req.ip,
    });
    await createNotification(
      milestoneStatus.user_id,
      "Milestone Status Completed",
      `Milestone status with ID ${req.params.id} has been marked as completed.`
    );
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Mark an investor milestone status as pending
const markInvestorMilestoneStatusAsPending = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(
      req.params.id
    );
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: `Marked Investor Milestone Status as Pending`,
      details: `User marked investor milestone status with ID ${req.params.id} as pending`,
      ip_address: req.ip,
    });
    await createNotification(
      milestoneStatus.user_id,
      "Milestone Status Pending",
      `Milestone status with ID ${req.params.id} has been marked as pending.`
    );
    await milestoneStatus.update({ status: "Pending" });
    res.status(200).json({ status: true, milestoneStatus });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete an investor milestone status
const deleteInvestorMilestoneStatus = async (req, res) => {
  try {
    const milestoneStatus = await InvestorMilestoneStatus.findByPk(
      req.params.id
    );
    if (!milestoneStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone status not found." });
    }
    await milestoneStatus.destroy();
    await createAuditLog({
      userId: req.user.id,
      action: `Deleted Investor Milestone Status`,
      details: `User deleted investor milestone status with ID ${req.params.id}`,
      ip_address: req.ip,
    });
    await createNotification(
      milestoneStatus.user_id,
      "Milestone Status Deleted",
      `Milestone status with ID ${req.params.id} has been deleted.`
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
  createInvestorMilestoneStatus,
  getAllInvestorMilestoneStatuses,
  getInvestorMilestoneStatusById,
  updateInvestorMilestoneStatus,
  deleteInvestorMilestoneStatus,
  getAllInvestorMilestoneStatusesByUserAndDeal,
  getAllInvestorMilestoneStatusesByUser,
  markInvestorMilestoneStatusAsCompleted,
  markInvestorMilestoneStatusAsPending,
};
