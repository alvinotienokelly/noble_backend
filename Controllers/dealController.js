// Controllers/dealController.js
const db = require("../Models");
const { Op } = require("sequelize");
const moment = require("moment");
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

// Get deals based on user's saved preference_sector & preference_region
const getDealsByUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in req.user
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    const preferenceSectorArray = user.preference_sector
      
    const preferenceRegionArray = user.preference_region
     

    if (!preferenceSectorArray || !preferenceRegionArray) {
      const deals = await Deal.findAll({
        include: [
          { model: User, as: "createdBy" },
          { model: User, as: "targetCompany" },
        ],
      });
      return res.status(200).json({ status: true, message:"" });
    }

    const deals = await Deal.findAll({
      where: {
        sector: {
          [Op.in]: preferenceSectorArray,
        },
        region: {
          [Op.in]: preferenceRegionArray,
        },
      },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
      ],
    });

    res.status(200).json({ status: true, deals });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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

    const startOfCurrentMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toDate();

    const lastMonthActiveDealsCount = await Deal.count({
      where: {
        status: "Active",
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
    });

    const currentMonthActiveDealsCount = await Deal.count({
      where: {
        status: "Active",
        createdAt: {
          [Op.gte]: startOfCurrentMonth,
        },
      },
    });

    let activeDealsPercentageChange = 0;
    if (lastMonthActiveDealsCount > 0) {
      activeDealsPercentageChange =
        ((currentMonthActiveDealsCount - lastMonthActiveDealsCount) /
          lastMonthActiveDealsCount) *
        100;
    } else if (currentMonthActiveDealsCount > 0) {
      activeDealsPercentageChange = 100;
    }

    const currentMonthDealsCount = await Deal.count({
      where: {
        createdAt: {
          [Op.gte]: startOfCurrentMonth,
        },
      },
    });

    const lastMonthDealsCount = await Deal.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
    });

    let dealsPercentageChange = 0;
    if (lastMonthDealsCount > 0) {
      dealsPercentageChange =
        ((currentMonthDealsCount - lastMonthDealsCount) / lastMonthDealsCount) *
        100;
    } else if (currentMonthDealsCount > 0) {
      dealsPercentageChange = 100;
    }
    const totalDealSize = await Deal.sum("deal_size");
    const startOfYear = moment().startOf("year").toDate();
    const startOfLastYear = moment()
      .subtract(1, "years")
      .startOf("year")
      .toDate();
    const endOfLastYear = moment().subtract(1, "years").endOf("year").toDate();

    const lastYearTotalDealSize = await Deal.sum("deal_size", {
      where: {
        createdAt: {
          [Op.between]: [startOfLastYear, endOfLastYear],
        },
      },
    });

    const currentYearTotalDealSize = await Deal.sum("deal_size", {
      where: {
        createdAt: {
          [Op.gte]: startOfYear,
        },
      },
    });

    let totalDealSizePercentageChange = 0;
    if (lastYearTotalDealSize > 0) {
      totalDealSizePercentageChange =
        ((currentYearTotalDealSize - lastYearTotalDealSize) /
          lastYearTotalDealSize) *
        100;
    } else if (currentYearTotalDealSize > 0) {
      totalDealSizePercentageChange = 100;
    }
    res.status(200).json({
      status: true,
      totalDealSize: totalDealSize,
      totalDeals: totalDeals,
      activeDeals: activeDeals,
      inactiveDeals: inactiveDeals,
      dealsPercentageChange: dealsPercentageChange,
      activeDealsPercentageChange: activeDealsPercentageChange,
      totalDealSizePercentageChange: totalDealSizePercentageChange,
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
  getDealsByUserPreferences,
};
