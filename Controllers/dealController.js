// Controllers/dealController.js
const db = require("../Models");
const Deal = db.deals;
const User = db.users; // Assuming User model is available in db

// Create a new deal
const createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      sector,
      region,
      deal_stage,
      deal_size,
      target_company_id,
      key_investors,
    } = req.body;
    const created_by = req.user.id; // Assuming the user ID is available in req.user

    const newDeal = await Deal.create({
      title,
      description,
      sector,
      region,
      deal_stage,
      deal_size,
      target_company_id,
      key_investors,
      created_by,
    });

    res.status(201).json({ status: true, deal: newDeal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all deals
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
      ],
    });
    const totalDeals = await Deal.count();
    const activeDeals = await Deal.count({ where: { status: "Active" } });
    const inactiveDeals = await Deal.count({ where: { status: "Inactive" } });
    res
      .status(200)
      .json({
        status: true,
        totalDeals: totalDeals,
        activeDeals: activeDeals,
        inactiveDeals: inactiveDeals,
        deals,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a single deal by deal_id (UUID)
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findOne({
      where: { deal_id: req.params.id },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
      ],
    });
    if (!deal) {
      return res
        .status(404)
        .json({ status: "false", message: "Deal not found." });
    }
    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a deal by ID
const updateDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      sector,
      region,
      deal_stage,
      deal_size,
      target_company_id,
      key_investors,
    } = req.body;
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res
        .status(404)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({
      title,
      description,
      sector,
      region,
      deal_stage,
      deal_size,
      target_company_id,
      key_investors,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a deal by ID
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res
        .status(404)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.destroy();
    res
      .status(200)
      .json({ status: true, message: "Deal deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
};
