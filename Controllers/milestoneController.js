// Controllers/milestoneController.js
const db = require("../Models");
const Milestone = db.milestones;
const Deal = db.deals;

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
};
