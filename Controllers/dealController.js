// Controllers/dealController.js
const db = require("../Models");
const { Op } = require("sequelize");
const moment = require("moment");
const Deal = db.deals;
const User = db.users; // Assuming User model is available in db
const Task = db.tasks;
const Document = db.documents;
const Transaction = db.Transaction;
const AuditLog = db.AuditLog;
const InvestorsDeals = db.investorsDeals;
const DealMeetings = db.dealMeetings;
const Milestone = db.milestones;
const DealAccessInvite = db.deal_access_invite;
const SignatureRecord = db.signature_record;

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

    const preferenceSectorArray = user.preference_sector;

    const preferenceRegionArray = user.preference_region;

    if (!preferenceSectorArray || !preferenceRegionArray) {
      const deals = await Deal.findAll({
        include: [
          { model: User, as: "createdBy" },
          { model: User, as: "targetCompany" },
        ],
      });
      return res.status(200).json({ status: true, message: "" });
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
    const totalDeals = deals.length;
    const activeDeals = deals.filter((deal) => deal.status === "Active").length;
    const inactiveDeals = deals.filter(
      (deal) => deal.status === "Inactive"
    ).length;

    const startOfCurrentMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toDate();

    const lastMonthActiveDealsCount = deals.filter(
      (deal) =>
        deal.status === "Active" &&
        moment(deal.createdAt).isBetween(startOfLastMonth, endOfLastMonth)
    ).length;

    const currentMonthActiveDealsCount = deals.filter(
      (deal) =>
        deal.status === "Active" &&
        moment(deal.createdAt).isSameOrAfter(startOfCurrentMonth)
    ).length;

    let activeDealsPercentageChange = 0;
    if (lastMonthActiveDealsCount > 0) {
      activeDealsPercentageChange =
        ((currentMonthActiveDealsCount - lastMonthActiveDealsCount) /
          lastMonthActiveDealsCount) *
        100;
    } else if (currentMonthActiveDealsCount > 0) {
      activeDealsPercentageChange = 100;
    }

    const currentMonthDealsCount = deals.filter((deal) =>
      moment(deal.createdAt).isSameOrAfter(startOfCurrentMonth)
    ).length;

    const lastMonthDealsCount = deals.filter((deal) =>
      moment(deal.createdAt).isBetween(startOfLastMonth, endOfLastMonth)
    ).length;

    let dealsPercentageChange = 0;
    if (lastMonthDealsCount > 0) {
      dealsPercentageChange =
        ((currentMonthDealsCount - lastMonthDealsCount) / lastMonthDealsCount) *
        100;
    } else if (currentMonthDealsCount > 0) {
      dealsPercentageChange = 100;
    }
    const totalDealSize = deals.reduce((sum, deal) => sum + deal.deal_size, 0);
    const startOfYear = moment().startOf("year").toDate();
    const startOfLastYear = moment()
      .subtract(1, "years")
      .startOf("year")
      .toDate();

    const endOfLastYear = moment().subtract(1, "years").endOf("year").toDate();

    const lastYearTotalDealSize = deals
      .filter((deal) =>
        moment(deal.createdAt).isBetween(startOfLastYear, endOfLastYear)
      )
      .reduce((sum, deal) => sum + deal.deal_size, 0);

    const currentYearTotalDealSize = deals
      .filter((deal) => moment(deal.createdAt).isSameOrAfter(startOfYear))
      .reduce((sum, deal) => sum + deal.deal_size, 0);

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

// Get getTargetCompanyDeals
const getTargetCompanyDeals = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in req.user

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    if (user.role !== "Target Company") {
      return res.status(200).json({ status: false, message: "Access denied." });
    }
    const deals = await Deal.findAll({
      where: {
        [Op.or]: [{ created_by: userId }, { target_company_id: userId }],
      },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
      ],
    });

    const totalDeals = deals.length;
    const activeDeals = deals.filter((deal) => deal.status === "Active").length;
    const inactiveDeals = deals.filter(
      (deal) => deal.status === "Inactive"
    ).length;

    const startOfCurrentMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toDate();

    const lastMonthActiveDealsCount = deals.filter(
      (deal) =>
        deal.status === "Active" &&
        moment(deal.createdAt).isBetween(startOfLastMonth, endOfLastMonth)
    ).length;

    const currentMonthActiveDealsCount = deals.filter(
      (deal) =>
        deal.status === "Active" &&
        moment(deal.createdAt).isSameOrAfter(startOfCurrentMonth)
    ).length;

    let activeDealsPercentageChange = 0;
    if (lastMonthActiveDealsCount > 0) {
      activeDealsPercentageChange =
        ((currentMonthActiveDealsCount - lastMonthActiveDealsCount) /
          lastMonthActiveDealsCount) *
        100;
    } else if (currentMonthActiveDealsCount > 0) {
      activeDealsPercentageChange = 100;
    }

    const currentMonthDealsCount = deals.filter((deal) =>
      moment(deal.createdAt).isSameOrAfter(startOfCurrentMonth)
    ).length;

    const lastMonthDealsCount = deals.filter((deal) =>
      moment(deal.createdAt).isBetween(startOfLastMonth, endOfLastMonth)
    ).length;

    let dealsPercentageChange = 0;
    if (lastMonthDealsCount > 0) {
      dealsPercentageChange =
        ((currentMonthDealsCount - lastMonthDealsCount) / lastMonthDealsCount) *
        100;
    } else if (currentMonthDealsCount > 0) {
      dealsPercentageChange = 100;
    }
    const totalDealSize = deals.reduce((sum, deal) => sum + deal.deal_size, 0);
    const startOfYear = moment().startOf("year").toDate();
    const startOfLastYear = moment()
      .subtract(1, "years")
      .startOf("year")
      .toDate();

    const endOfLastYear = moment().subtract(1, "years").endOf("year").toDate();

    const lastYearTotalDealSize = deals
      .filter((deal) =>
        moment(deal.createdAt).isBetween(startOfLastYear, endOfLastYear)
      )
      .reduce((sum, deal) => sum + deal.deal_size, 0);

    const currentYearTotalDealSize = deals
      .filter((deal) => moment(deal.createdAt).isSameOrAfter(startOfYear))
      .reduce((sum, deal) => sum + deal.deal_size, 0);

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
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    // Delete related records
    await Task.destroy({ where: { deal_id: deal.deal_id } });
    await Document.destroy({ where: { deal_id: deal.deal_id } });
    await Transaction.destroy({ where: { deal_id: deal.deal_id } });
    await InvestorsDeals.destroy({ where: { deal_id: deal.deal_id } });
    await DealMeetings.destroy({ where: { deal_id: deal.deal_id } });
    await Milestone.destroy({ where: { deal_id: deal.deal_id } });
    await DealAccessInvite.destroy({ where: { deal_id: deal.deal_id } });
    await SignatureRecord.destroy({ where: { deal_id: deal.deal_id } });

    await deal.destroy();
    res
      .status(200)
      .json({ status: true, message: "Deal deleted successfully." });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getDealsByUserPreferences,
  getTargetCompanyDeals,
};
