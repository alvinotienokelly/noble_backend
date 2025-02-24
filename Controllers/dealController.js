// Controllers/dealController.js
const db = require("../Models");
const { Op } = require("sequelize");
const moment = require("moment");
const Deal = db.deals;
const User = db.users; // Assuming User model is available in db
const Document = db.documents;
const Transaction = db.Transaction;
const AuditLog = db.AuditLog;
const InvestorsDeals = db.investorsDeals;
const DealMeetings = db.dealMeetings;
const Milestone = db.milestones;
const DealAccessInvite = db.deal_access_invite;
const SignatureRecord = db.signature_record;
const { trackInvestorBehavior } = require("./investorsDealsController");
const DealContinent = db.deal_continents;
const DealRegion = db.deal_regions;
const DealCountry = db.deal_countries;
const Country = db.country;
const Region = db.regions;
const DealStage = db.deal_stages;
const Task = db.tasks;
const { createAuditLog } = require("./auditLogService");
// const DealAccessInvite = db.deal_access_invite;
const Continent = db.continents;

// Create a new deal
const createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      deal_stage_id,
      deal_size,
      target_company_id,
      key_investors,
      deal_lead,
      has_information_memorandum,
      has_vdr,
      consultant_name,
      sector_id,
      subsector_id,
      deal_type,
      teaser,
      maximum_selling_stake,
      ticket_size,
      project,
      model,
      continent_ids, // Expecting array of continent IDs
      region_ids,
      country_ids,
      retainer_amount,
      success_fee,
    } = req.body;
    const created_by = req.user.id; // Assuming the user ID is available in req.user
    const success_fee_percentage = (success_fee / 100) * deal_size;

    const newDeal = await Deal.create({
      title,
      description,
      deal_stage_id,
      deal_size,
      target_company_id,
      key_investors,
      deal_lead,
      deal_type,
      teaser,
      has_information_memorandum,
      has_vdr,
      consultant_name,
      maximum_selling_stake,
      created_by,
      ticket_size,
      project,
      model,
      retainer_amount, // Include retainer_amount
      success_fee_percentage, // Include access_fee_amount
    });

    // Loop through continent_ids and create entries in DealContinent
    if (continent_ids && continent_ids.length > 0) {
      for (const continent_id of continent_ids) {
        await DealContinent.create({
          deal_id: newDeal.deal_id,
          continent_id,
        });
      }
    }

    // Loop through region_ids and create entries in DealRegion
    if (region_ids && region_ids.length > 0) {
      for (const region_id of region_ids) {
        await DealRegion.create({
          deal_id: newDeal.deal_id,
          region_id,
        });
      }
    }

    // Loop through country_ids and create entries in DealCountry
    if (country_ids && country_ids.length > 0) {
      for (const country_id of country_ids) {
        await DealCountry.create({
          deal_id: newDeal.deal_id,
          country_id,
        });
      }
    }
    // Create an audit log entry
    await createAuditLog({
      userId: created_by,
      action: "CREATE_DEAL",
      details: `Deal ${newDeal.title} created with ID ${newDeal.deal_id}`,
      ip_address: req.ip,
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
          {
            model: DealCountry,
            as: "dealCountries",
            include: [{ model: Country, as: "country" }],
          },
          {
            model: DealRegion,
            as: "dealRegions",
            include: [{ model: Region, as: "region" }],
          },
          {
            model: DealContinent,
            as: "dealContinents",
            include: ["continent"],
          },
        ],
      });
      return res.status(200).json({ status: true, message: "" });
    }

    const deals = await Deal.findAll({
      // where: {
      //   sector: {
      //     [Op.in]: preferenceSectorArray,
      //   },
      //   region: {
      //     [Op.in]: preferenceRegionArray,
      //   },
      // },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
        {
          model: DealCountry,
          as: "dealCountries",
          include: [{ model: Country, as: "country" }],
        },
        {
          model: DealRegion,
          as: "dealRegions",
          include: [{ model: Region, as: "region" }],
        },
        { model: DealContinent, as: "dealContinents", include: ["continent"] },
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
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalDeals, rows: deals } = await Deal.findAndCountAll({
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
        {
          model: DealStage,
          as: "dealStage",
        },
        {
          model: DealCountry,
          as: "dealCountries",
          include: [{ model: Country, as: "country" }],
        },
        {
          model: DealRegion,
          as: "dealRegions",
          include: [{ model: Region, as: "region" }],
        },
        { model: DealContinent, as: "dealContinents", include: ["continent"] },
      ],
      offset,
      limit: parseInt(limit),
    });

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

    const totalPages = Math.ceil(totalDeals / limit);

    await createAuditLog({
      userId: req.user.id,
      action: "GET_ALL_DEALS",
      details: `Fetched all deals with pagination - Page: ${page}, Limit: ${limit}`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      totalDealSize: totalDealSize,
      totalDeals: totalDeals,
      activeDeals: activeDeals,
      inactiveDeals: inactiveDeals,
      dealsPercentageChange: dealsPercentageChange,
      activeDealsPercentageChange: activeDealsPercentageChange,
      totalDealSizePercentageChange: totalDealSizePercentageChange,
      currentPage: parseInt(page),
      totalPages: totalPages,
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

    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;

    const { count: totalDeals, rows: deals } = await Deal.findAndCountAll({
      where: {
        [Op.or]: [{ created_by: userId }, { target_company_id: userId }],
      },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
      ],
      offset,
      limit: parseInt(limit),
    });

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

    const totalPages = Math.ceil(totalDeals / limit);

    await createAuditLog({
      userId: userId,
      action: "GET_TARGET_COMPANY_DEALS",
      details: `Fetched target company deals with pagination - Page: ${page}, Limit: ${limit}`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      totalDealSize: totalDealSize,
      totalDeals: totalDeals,
      activeDeals: activeDeals,
      inactiveDeals: inactiveDeals,
      dealsPercentageChange: dealsPercentageChange,
      activeDealsPercentageChange: activeDealsPercentageChange,
      totalDealSizePercentageChange: totalDealSizePercentageChange,
      currentPage: parseInt(page),
      totalPages: totalPages,
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
        {
          model: DealAccessInvite,
          as: "dealAccessInvites",
          include: [
            {
              model: User,
              as: "investor",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
        {
          model: DealStage,
          as: "dealStage",
        },
        {
          model: DealCountry,
          as: "dealCountries",
          include: [{ model: Country, as: "country" }],
        },
        {
          model: DealRegion,
          as: "dealRegions",
          include: [{ model: Region, as: "region" }],
        },
        { model: DealContinent, as: "dealContinents", include: ["continent"] },
      ],
    });
    if (!deal) {
      return res
        .status(200)
        .json({ status: "false", message: "Deal not found." });
    }
    const created_by = req.user.id;

    // Fetch milestones and group them by deal stages
    const milestones = await Milestone.findAll({
      where: { deal_id: deal.deal_id },
      include: [{ model: DealStage, as: "dealStage" }],
      order: [["createdAt", "ASC"]],
    });

    const groupedMilestones = milestones.reduce((acc, milestone) => {
      const stageName = milestone.dealStage.name; // Assuming dealStage has a 'name' field
      if (!acc[stageName]) {
        acc[stageName] = [];
      }
      acc[stageName].push(milestone);
      return acc;
    }, {});

    // Fetch tasks and group them by deal stages
    const tasks = await Task.findAll({
      where: { deal_id: deal.deal_id },
      include: [{ model: DealStage, as: "dealStage" }],
      order: [["createdAt", "ASC"]],
    });

    const groupedTasks = tasks.reduce((acc, task) => {
      const stageName = task.dealStage.name; // Assuming dealStage has a 'name' field
      if (!acc[stageName]) {
        acc[stageName] = [];
      }
      acc[stageName].push(task);
      return acc;
    }, {});

    await trackInvestorBehavior(created_by, deal.deal_id);

    await createAuditLog({
      userId: created_by,
      action: "VIEW_DEAL",
      details: `Viewed deal with ID ${deal.deal_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      deal,
      dealStages: groupedMilestones,
      tasks: groupedTasks,
    });
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
      deal_lead,
      deal_stage_id,
      deal_size,
      target_company_id,
      key_investors,
      sector_id,
      subsector_id,
      deal_type,
      teaser,
      has_information_memorandum,
      has_vdr,
      consultant_name,
      maximum_selling_stake,
      ticket_size,
      project,
      model,
      continent_ids, // Expecting array of continent IDs
      region_ids, // Expecting array of region IDs
      country_ids, // Expecting array of country IDs
      retainer_amount, // Add retainer_amount
      success_fee, // Add access_fee_amount
    } = req.body;
    const deal = await Deal.findByPk(req.params.id);
    const id = deal.deal_id;
    const success_fee_percentage = (success_fee / 100) * deal_size;

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({
      title,
      description,
      deal_stage_id,
      deal_size,
      target_company_id,
      key_investors,
      deal_lead,
      deal_type,
      teaser,
      has_information_memorandum,
      has_vdr,
      consultant_name,
      maximum_selling_stake,
      ticket_size,

      project,
      model,
      retainer_amount, // Include retainer_amount
      success_fee_percentage, // Include access_fee_amount
    });

    // Update DealContinent entries
    if (continent_ids) {
      await DealContinent.destroy({ where: { deal_id: id } });
      for (const continent_id of continent_ids) {
        await DealContinent.create({
          deal_id: id,
          continent_id,
        });
      }
    }

    // Update DealRegion entries
    if (region_ids) {
      await DealRegion.destroy({ where: { deal_id: id } });
      for (const region_id of region_ids) {
        await DealRegion.create({
          deal_id: id,
          region_id,
        });
      }
    }

    // Update DealCountry entries
    if (country_ids) {
      await DealCountry.destroy({ where: { deal_id: id } });
      for (const country_id of country_ids) {
        await DealCountry.create({
          deal_id: id,
          country_id,
        });
      }
    }

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_DEAL",
      details: `Updated deal with ID ${deal.deal_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a deal by ID
const updateDealStage = async (req, res) => {
  try {
    const { deal_stage_id } = req.body;
    const deal = await Deal.findByPk(req.params.id);
    const id = deal.deal_id;

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({
      deal_stage_id,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_DEAL",
      details: `Updated deal with ID ${deal.deal_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to filter deals
const filterDeals = async (req, res) => {
  try {
    const {
      title,
      description,
      deal_size_min,
      deal_size_max,
      target_company_id,
      key_investors,
      sector_id,
      subsector_id,
      status,
      visibility,
      created_by,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      deal_type,
      archived,
      continent_id, // Add continent_id
      region_id, // Add region_id
      country_id, // Add country_id
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
    }

    if (description) {
      whereClause.description = { [Op.iLike]: `%${description}%` }; // Case-insensitive search
    }

    if (deal_size_min) {
      whereClause.deal_size = { [Op.gte]: parseFloat(deal_size_min) };
    }

    if (deal_size_max) {
      if (whereClause.deal_size) {
        whereClause.deal_size[Op.lte] = parseFloat(deal_size_max);
      } else {
        whereClause.deal_size = { [Op.lte]: parseFloat(deal_size_max) };
      }
    }

    if (target_company_id) {
      whereClause.target_company_id = target_company_id;
    }
    if (sector_id) {
      whereClause.sector_id = sector_id;
    }

    if (subsector_id) {
      whereClause.subsector_id = subsector_id;
    }

    if (key_investors) {
      whereClause.key_investors = { [Op.iLike]: `%${key_investors}%` }; // Case-insensitive search
    }

    if (status) {
      whereClause.status = status;
    }

    if (visibility) {
      whereClause.visibility = visibility;
    }

    if (created_by) {
      whereClause.created_by = created_by;
    }

    if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.createdAt) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      } else {
        whereClause.createdAt = { [Op.lte]: new Date(endDate) };
      }
    }

    if (deal_type) {
      whereClause.deal_type = deal_type;
    }

    if (archived !== undefined) {
      whereClause.archived = archived === "true";
    }

    // Add filters for continent_id, region_id, and country_id
    const includeClause = [];

    if (continent_id) {
      includeClause.push({
        model: DealContinent,
        as: "dealContinents",
        where: { continent_id },
        include: [{ model: Continent, as: "continent" }],
      });
    }

    if (region_id) {
      includeClause.push({
        model: DealRegion,
        as: "dealRegions",
        where: { region_id },
        include: [{ model: Region, as: "region" }],
      });
    }

    if (country_id) {
      includeClause.push({
        model: DealCountry,
        as: "dealCountries",
        where: { country_id },
        include: [{ model: Country, as: "country" }],
      });
    }

    const { count: totalDeals, rows: deals } = await Deal.findAndCountAll({
      where: whereClause,
      include: includeClause.length > 0 ? includeClause : undefined,
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalDeals / limit);

    if (!deals || deals.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No deals found for the specified criteria.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "FILTER_DEALS",
      details: `Filtered deals with criteria: ${JSON.stringify(req.query)}`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      totalDeals,
      totalPages,
      currentPage: parseInt(page),
      deals,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const recommendDeals = async (investorId) => {
  try {
    const investor = await User.findByPk(investorId);

    if (!investor) {
      throw new Error("Investor not found.");
    }

    const recommendedDeals = await Deal.findAll({
      where: {
        sector: {
          [Op.in]: investor.preference_sector,
        },
        region: {
          [Op.in]: investor.preference_region,
        },
      },
      include: [
        { model: User, as: "createdBy" },
        { model: User, as: "targetCompany" },
        {
          model: DealCountry,
          as: "dealCountries",
          include: [{ model: Country, as: "country" }],
        },
        {
          model: DealRegion,
          as: "dealRegions",
          include: [{ model: Region, as: "region" }],
        },
        { model: DealContinent, as: "dealContinents", include: ["continent"] },
      ],
    });

    return recommendedDeals;
  } catch (error) {
    console.error("Error recommending deals:", error);
    return [];
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

// Get milestones and tasks by deal_id and deal_stage_id
const getMilestonesAndTasksByDealAndStage = async (req, res) => {
  try {
    const { deal_id, deal_stage_id } = req.params;

    // Fetch the deal to ensure it exists
    const deal = await Deal.findByPk(deal_id, {
      include: [{ model: DealStage, as: "dealStage" }],
    });

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    // Fetch milestones associated with the deal and deal stage
    const milestones = await Milestone.findAll({
      where: { deal_id, deal_stage_id },
      include: [{ model: DealStage, as: "dealStage" }],
      order: [["createdAt", "ASC"]],
    });

    // Fetch tasks associated with the deal and deal stage
    const tasks = await Task.findAll({
      where: { deal_id, deal_stage_id },
      include: [{ model: DealStage, as: "dealStage" }],
      order: [["createdAt", "ASC"]],
    });

    await createAuditLog({
      userId: req.user.id,
      action: "GET_MILESTONES_AND_TASKS",
      details: `Fetched milestones and tasks for deal ID ${deal_id} and stage ID ${deal_stage_id}`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, milestones, tasks });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to get all deals in which an investor has a DealAccessInvite that is Accepted
const getAcceptedDealsForInvestor = async (req, res) => {
  try {
    const investor_id = req.user.id;

    const invites = await DealAccessInvite.findAll({
      where: { investor_id, status: "Accepted" },
      include: [
        {
          model: Deal,
          as: "deal",
          include: [
            { model: User, as: "createdBy" },
            { model: User, as: "targetCompany" },
            {
              model: DealCountry,
              as: "dealCountries",
              include: [{ model: Country, as: "country" }],
            },
            {
              model: DealRegion,
              as: "dealRegions",
              include: [{ model: Region, as: "region" }],
            },
            {
              model: DealContinent,
              as: "dealContinents",
              include: ["continent"],
            },
          ],
        },
      ],
    });

    if (!invites || invites.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No accepted deals found for the specified investor.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "GET_ACCEPTED_DEALS_FOR_INVESTOR",
      details: `Fetched accepted deals for investor ${investor_id}`,
      ip_address: req.ip,
    });

    const deals = invites.map((invite) => invite.deal);

    res.status(200).json({
      status: true,
      deals,
    });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Active
const markDealAsActive = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "Active" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_ACTIVE",
      details: `Marked deal with ID ${deal_id} as Active`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Pending
const markDealAsPending = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "Pending" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_PENDING",
      details: `Marked deal with ID ${deal_id} as Pending`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Pending
const markDealOnhold = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "On Hold" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_ON_HOLD",
      details: `Marked deal with ID ${deal_id} as Pending`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Pending
const markDealClosed = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "Closed" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_Closed",
      details: `Marked deal with ID ${deal_id} as Pending`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Pending
const markDealClosedAndOpened = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "Closed & Reopened" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_Closed_AND_OPENED",
      details: `Marked deal with ID ${deal_id} as Pending`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a deal status as Active
const markDealAsArchived = async (req, res) => {
  try {
    const deal_id = req.params.id;
    const deal = await Deal.findByPk(deal_id);

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    await deal.update({ status: "Archived" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_DEAL_AS_ARCHIVED",
      details: `Marked deal with ID ${deal_id} as Active`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, deal });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to filter deals by continent_id, region_id, or country_id
const filterDealsByLocation = async (req, res) => {
  try {
    const {
      continent_id,
      region_id,
      country_id,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (continent_id) {
      whereClause["$dealContinents.continent_id$"] = continent_id;
    }

    if (region_id) {
      whereClause["$dealRegions.region_id$"] = region_id;
    }

    if (country_id) {
      whereClause["$dealCountries.country_id$"] = country_id;
    }

    const { count: totalDeals, rows: deals } = await Deal.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: DealContinent,
          as: "dealContinents",
          include: [{ model: Continent, as: "continent" }],
        },
        {
          model: DealRegion,
          as: "dealRegions",
          include: [{ model: Region, as: "region" }],
        },
        {
          model: DealCountry,
          as: "dealCountries",
          include: [{ model: Country, as: "country" }],
        },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalDeals / limit);

    if (!deals || deals.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No deals found for the specified criteria.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "FILTER_DEALS_BY_LOCATION",
      details: `Filtered deals by location - Continent ID: ${continent_id}, Region ID: ${region_id}, Country ID: ${country_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      totalDeals,
      totalPages,
      currentPage: parseInt(page),
      deals,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  markDealAsArchived,
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getDealsByUserPreferences,
  getTargetCompanyDeals,
  filterDeals,
  recommendDeals,
  getMilestonesAndTasksByDealAndStage, // Add this line
  getAcceptedDealsForInvestor, // Add this line
  markDealAsActive,
  markDealAsPending,
  markDealOnhold,
  markDealClosed,
  markDealClosedAndOpened,
  filterDealsByLocation,
  updateDealStage,
};
