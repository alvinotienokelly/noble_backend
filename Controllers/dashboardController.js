// Controllers/dashboardController.js
const db = require("../Models");
const Deal = db.deals;
const User = db.users;
const Sector = db.sectors;

const { Op } = require("sequelize");

const getDashboardDealStatusData = async (req, res) => {
  try {
    // Fetch deals grouped by status
    const dealsByStatus = await Deal.findAll({
      attributes: [
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["status"],
    });

    // Fetch deals grouped by team member and status
    const dealsByTeamMemberAndStatus = await Deal.findAll({
      attributes: [
        "deal_lead",
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_lead", "status", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["id", "name"] }],
    });

    // Fetch total sales
    const totalSales = await Deal.sum("deal_size");

    // Fetch total deals
    const totalDeals = await Deal.count();

    // Calculate percentage for each deal_lead status
    const dealsByTeamMemberWithPercentage = dealsByTeamMemberAndStatus.reduce(
      (acc, deal) => {
        const dealLeadId = deal.deal_lead;
        const status = deal.status;
        const count = deal.get("count");

        if (!acc[dealLeadId]) {
          acc[dealLeadId] = {
            deal_lead: dealLeadId,
            dealLead: deal.dealLead,
            statuses: {},
            total: 0,
          };
        }

        acc[dealLeadId].statuses[status] = {
          count,
          percentage: ((count / totalDeals) * 100).toFixed(2),
        };
        acc[dealLeadId].total += count;

        return acc;
      },
      {}
    );

    // Convert the result to an array
    const dealsByTeamMemberArray = Object.values(
      dealsByTeamMemberWithPercentage
    );

    res.status(200).json({
      status: true,
      data: {
        dealsByStatus,
        dealsByTeamMember: dealsByTeamMemberArray,
        totalDeals,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDashboardDealTypeData = async (req, res) => {
  try {
    // Fetch deals grouped by deal type
    const dealsByType = await Deal.findAll({
      attributes: [
        "deal_type",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_type"],
    });

    // Fetch deals grouped by team member and deal type
    const dealsByTeamMemberAndType = await Deal.findAll({
      attributes: [
        "deal_lead",
        "deal_type",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_lead", "deal_type", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["id", "name"] }],
    });

    // Fetch total deals
    const totalDeals = await Deal.count();

    // Calculate counts and percentages for each deal_lead and deal_type
    const dealsByTeamMemberAndTypeSummary = dealsByTeamMemberAndType.reduce(
      (acc, deal) => {
        const dealLeadId = deal.deal_lead;
        const dealType = deal.deal_type;
        const count = deal.get("count");

        if (!acc[dealLeadId]) {
          acc[dealLeadId] = {
            deal_lead: dealLeadId,
            dealLead: deal.dealLead,
            types: {},
            total: 0,
          };
        }

        acc[dealLeadId].types[dealType] = {
          count,
          percentage: ((count / totalDeals) * 100).toFixed(2),
        };
        acc[dealLeadId].total += count;

        return acc;
      },
      {}
    );

    // Convert the result to an array
    const dealsByTeamMemberAndTypeArray = Object.values(
      dealsByTeamMemberAndTypeSummary
    );

    res.status(200).json({
      status: true,
      data: {
        dealsByType,
        dealsByTeamMemberAndType: dealsByTeamMemberAndTypeArray,
        totalDeals,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDashboardDealSectorData = async (req, res) => {
  try {
    // Fetch deals grouped by sector
    const dealsBySector = await Deal.findAll({
      attributes: [
        "sector_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["sector_id"],
      include: [
        { model: Sector, as: "dealSector", attributes: ["sector_id", "name"] },
      ],
    });

    // Fetch deals grouped by team member and sector
    const dealsByTeamMemberAndSector = await Deal.findAll({
      attributes: [
        "deal_lead",
        "sector_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: [
        "deal_lead",
        "sector_id",
        "dealLead.id",
        "dealLead.name",
        "dealSector.sector_id",
        "dealSector.name",
      ],
      include: [
        { model: User, as: "dealLead", attributes: ["id", "name"] },
        { model: Sector, as: "dealSector", attributes: ["sector_id", "name"] },
      ],
    });

    // Fetch total deals
    const totalDeals = await Deal.count();

    // Calculate counts and percentages for each deal_lead and sector
    const dealsByTeamMemberAndSectorSummary = dealsByTeamMemberAndSector.reduce(
      (acc, deal) => {
        const dealLeadId = deal.deal_lead;
        const sectorId = deal.sector_id;
        const sectorName = deal.dealSector.name;
        const count = deal.get("count");

        if (!acc[dealLeadId]) {
          acc[dealLeadId] = {
            deal_lead: dealLeadId,
            dealLead: deal.dealLead,
            sectors: {},
            total: 0,
          };
        }

        acc[dealLeadId].sectors[sectorName] = {
          count,
          percentage: ((count / totalDeals) * 100).toFixed(2),
        };
        acc[dealLeadId].total += count;

        return acc;
      },
      {}
    );

    // Convert the result to an array
    const dealsByTeamMemberAndSectorArray = Object.values(
      dealsByTeamMemberAndSectorSummary
    );

    res.status(200).json({
      status: true,
      data: {
        dealsBySector,
        dealsByTeamMemberAndSector: dealsByTeamMemberAndSectorArray,
        totalDeals,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDashboardDealSizeData = async (req, res) => {
  try {
    // Define deal size ranges
    const dealSizeRanges = [
      { label: "$0 - $1Mn", min: 0, max: 1_000_000 },
      { label: "$1.1 - $5Mn", min: 1_100_000, max: 5_000_000 },
      { label: "$5.1 - $10Mn", min: 5_100_000, max: 10_000_000 },
      { label: "$10.1 - $100Mn", min: 10_100_000, max: 100_000_000 },
    ];

    // Fetch deals grouped by team member and deal size range
    const dealsByTeamMemberAndSize = await Deal.findAll({
      attributes: [
        "deal_lead",
        "deal_size",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_lead", "deal_size", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["id", "name"] }],
    });

    // Fetch total deals
    const totalDeals = await Deal.count();

    // Calculate counts and percentages for each deal_lead and deal_size range
    const dealsByTeamMemberAndSizeSummary = dealsByTeamMemberAndSize.reduce(
      (acc, deal) => {
        const dealLeadId = deal.deal_lead;
        const dealSize = deal.deal_size;
        const count = deal.get("count");

        // Determine the deal size range
        const dealSizeRange = dealSizeRanges.find(
          (range) => dealSize >= range.min && dealSize <= range.max
        );

        if (!dealSizeRange) return acc;

        if (!acc[dealLeadId]) {
          acc[dealLeadId] = {
            deal_lead: dealLeadId,
            dealLead: deal.dealLead,
            sizes: {},
            total: 0,
          };
        }

        if (!acc[dealLeadId].sizes[dealSizeRange.label]) {
          acc[dealLeadId].sizes[dealSizeRange.label] = {
            count: 0,
            percentage: 0,
          };
        }

        acc[dealLeadId].sizes[dealSizeRange.label].count += count;
        acc[dealLeadId].sizes[dealSizeRange.label].percentage = (
          (acc[dealLeadId].sizes[dealSizeRange.label].count / totalDeals) *
          100
        ).toFixed(2);
        acc[dealLeadId].total += count;

        return acc;
      },
      {}
    );

    // Convert the result to an array
    const dealsByTeamMemberAndSizeArray = Object.values(
      dealsByTeamMemberAndSizeSummary
    );

    res.status(200).json({
      status: true,
      data: {
        dealsByTeamMemberAndSize: dealsByTeamMemberAndSizeArray,
        totalDeals,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getDashboardDealStatusData,
  getDashboardDealTypeData,
  getDashboardDealSectorData,
  getDashboardDealSizeData,
};
