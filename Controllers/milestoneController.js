// Controllers/milestoneController.js
const db = require("../Models");
const Milestone = db.milestones;
const Deal = db.deals;
const DealStage = db.deal_stages;
const { Op } = require("sequelize");
const { updateMilestoneStatus } = require("./commissionController");
const { createAuditLog } = require("./auditLogService");

// Create a new milestone
const createMilestone = async (req, res) => {
  try {
    const { deal_id, title, description, due_date, deal_stage_id } = req.body;

    const milestone = await Milestone.create({
      deal_id,
      title,
      deal_stage_id,
      description,
      due_date,
    });
    await createAuditLog({
      userId: req.user.id,
      action: "CREATE_MILESTONE",
      ip_address: req.ip,
      description: `Milestone ${milestone.title} created.`,
    });

    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all milestones for a deal
const getMilestonesByDealId = async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      where: { deal_id: req.params.dealId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Deal,
          as: "deal",
        },
        {
          model: DealStage,
          as: "dealStage",
        },
      ],
    });

    await createAuditLog({
      userId: req.user.id,
      action: "GET_MILESTONES_BY_DEAL_ID",
      ip_address: req.ip,
      description: `Fetched milestones for deal ID ${req.params.dealId}.`,
    });

    res.status(200).json({ status: true, milestones });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Update a milestone
const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(200)
        .json({ status: false, message: "Milestone not found." });
    }

    await milestone.update(req.body);
    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_MILESTONE",
      ip_address: req.ip,
      description: `Milestone ${milestone.title} updated.`,
    });
    await updateMilestoneStatus(req, res);
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Filter milestones by various criteria
const filterMilestones = async (req, res) => {
  try {
    const {
      title,
      status,
      deal_id,
      startDate,
      deal_stage_id,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
    }

    if (status) {
      whereClause.status = status;
    }
    if (deal_stage_id) {
      whereClause.deal_stage_id = deal_stage_id;
    }
    if (deal_id) {
      whereClause.deal_id = deal_id;
    }

    if (startDate) {
      whereClause.due_date = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.due_date) {
        whereClause.due_date[Op.lte] = new Date(endDate);
      } else {
        whereClause.due_date = { [Op.lte]: new Date(endDate) };
      }
    }

    const { count: totalMilestones, rows: milestones } =
      await Milestone.findAndCountAll({
        where: whereClause,
        order: [["createdAt", "ASC"]],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalMilestones / limit);

    if (!milestones || milestones.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No milestones found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalMilestones,
      totalPages,
      currentPage: parseInt(page),
      milestones,
    });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get milestones for deals belonging to the logged-in user
const getMilestonesForUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the logged-in user's information
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const deals = await Deal.findAll({
      where: { target_company_id: userId },
      attributes: ["deal_id"],
    });

    const dealIds = deals.map((deal) => deal.deal_id);

    const { count: totalMilestones, rows: milestones } =
      await Milestone.findAndCountAll({
        where: { deal_id: { [Op.in]: dealIds } },
        order: [["createdAt", "ASC"]],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalMilestones / limit);

    if (!milestones || milestones.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No milestones found for your deals.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "GET_MILESTONES_FOR_USER",
      ip_address: req.ip,
      description: `Fetched milestones for user ID ${userId}.`,
    });

    res.status(200).json({
      status: true,
      totalMilestones,
      totalPages,
      currentPage: parseInt(page),
      milestones,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a milestone
const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(200)
        .json({ status: false, message: "Milestone not found." });
    }

    await milestone.destroy();
    await createAuditLog({
      userId: req.user.id,
      action: "DELETE_MILESTONE",
      ip_address: req.ip,
      description: `Milestone ${milestone.title} deleted.`,
    });
    res
      .status(200)
      .json({ status: true, message: "Milestone deleted successfully." });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  createMilestone,
  getMilestonesByDealId,
  updateMilestone,
  deleteMilestone,
  filterMilestones,
  getMilestonesForUser,
};
