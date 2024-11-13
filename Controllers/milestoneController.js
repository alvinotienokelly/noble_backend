// Controllers/milestoneController.js
const db = require("../Models");
const Milestone = db.milestones;
const Deal = db.deals;
const { Op } = require("sequelize");

// Create a new milestone
const createMilestone = async (req, res) => {
  try {
    const { deal_id, title, description, due_date } = req.body;

    const milestone = await Milestone.create({
      deal_id,
      title,
      description,
      due_date,
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
    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Filter milestones by various criteria
const filterMilestones = async (req, res) => {
  try {
    const { title, status, deal_id, startDate, endDate } = req.query;
    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
    }

    if (status) {
      whereClause.status = status;
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

    const milestones = await Milestone.findAll({
      where: whereClause,
      order: [["createdAt", "ASC"]],
    });

    if (!milestones || milestones.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No milestones found for the specified criteria.",
      });
    }

    res.status(200).json({ status: true, milestones });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get milestones for deals belonging to the logged-in user
const getMilestonesForUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the logged-in user's information

    const deals = await Deal.findAll({
      where: { target_company_id: userId },
      attributes: ["deal_id"],
    });

    const dealIds = deals.map((deal) => deal.deal_id);

    const milestones = await Milestone.findAll({
      where: { deal_id: { [Op.in]: dealIds } },
      order: [["createdAt", "ASC"]],
      include: [{ model: Deal, as: "deal" }],
    });

    res.status(200).json({ status: true, milestones });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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
