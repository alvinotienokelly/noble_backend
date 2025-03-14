// Controllers/dashboardController.js
const db = require("../Models");
const Deal = db.deals;
const User = db.users;
const Sector = db.sectors;
const { createAuditLog } = require("./auditLogService");

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

    // Fetch sum of deal sizes grouped by deal lead
    const dealSizes = await Deal.findAll({
      attributes: [
        "deal_lead",
        [db.sequelize.fn("SUM", db.sequelize.col("deal_size")), "size"],
      ],
      group: ["deal_lead", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["name"] }],
    });

    // Format the result
    const dealSizeStats = dealSizes.map((deal) => ({
      lead: deal.dealLead.name,
      size: deal.get("size"),
    }));

    // Fetch deals grouped by deal lead and status
    const dealsByLeadAndStatus = await Deal.findAll({
      attributes: [
        "deal_lead",
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_lead", "deal.status", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["name"] }],
    });

    // Format the result
    const dealsByLeadAndStatusStats = dealsByLeadAndStatus.reduce(
      (acc, deal) => {
        const leadName = deal.dealLead.name;
        const status = deal.status;
        const count = deal.get("count");

        if (!acc[leadName]) {
          acc[leadName] = {};
        }

        acc[leadName][status] = count;
        return acc;
      },
      {}
    );

    // Fetch deals grouped by sector and deal lead
    const dealsBySectorAndLead = await Deal.findAll({
      attributes: [
        "sector_id",
        "deal_lead",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: [
        "deal.sector_id",
        "deal_lead",
        "dealSector.sector_id",
        "dealSector.name",
        "dealLead.id",
        "dealLead.name",
      ],
      include: [
        { model: Sector, as: "dealSector", attributes: ["name"] },
        { model: User, as: "dealLead", attributes: ["name"] },
      ],
    });

    // Format the result
    const sectorData = dealsBySectorAndLead.reduce((acc, deal) => {
      const sectorName = deal.dealSector.name;
      const leadName = deal.dealLead.name;
      const count = deal.get("count");

      if (!acc[sectorName]) {
        acc[sectorName] = {};
      }

      acc[sectorName][leadName] = count;
      return acc;
    }, {});

    // Fetch deals grouped by deal lead and deal type
    const dealsByLeadAndType = await Deal.findAll({
      attributes: [
        "deal_lead",
        "deal_type",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["deal_lead", "deal_type", "dealLead.id", "dealLead.name"],
      include: [{ model: User, as: "dealLead", attributes: ["name"] }],
    });

    // Format the result
    const dealsByLeadAndTypeStats = dealsByLeadAndType.reduce((acc, deal) => {
      const dealType = deal.deal_type;
      const leadName = deal.dealLead.name;
      const count = deal.get("count");

      let category = acc.find((item) => item.category === dealType);
      if (!category) {
        category = { category: dealType };
        acc.push(category);
      }

      category[leadName] = count;
      return acc;
    }, []);

    const rawData = dealsByLeadAndTypeStats;

    // Call createAuditLog
    await createAuditLog({
      userId: req.user.id,
      action: "FETCH_DASHBOARD_DEAL_STATUS_DATA",
      details: `User ${req.user.id} fetched dashboard deal status data`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      data: {
        dealsByStatus,
        dealSizeStats,
        dealsBySectorAndLead: dealsBySectorAndLead,
        dealsByLeadAndStatusStats: dealsByLeadAndStatusStats,
        dealsByLeadAndTypeStats: dealsByLeadAndTypeStats,
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
    // Call createAuditLog
    await createAuditLog({
      userId: req.user.id,
      action: "FETCH_DASHBOARD_DEAL_TYPE_DATA",
      details: `User ${req.user.id} fetched dashboard deal type data`,
      ip_address: req.ip,
    });

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

    await createAuditLog({
      userId: req.user.id,
      action: "FETCH_DASHBOARD_DEAL_SECTOR_DATA",
      details: `User ${req.user.id} fetched dashboard deal sector data`,
      ip_address: req.ip,
    });
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

    await createAuditLog({
      userId: req.user.id,
      action: "FETCH_DASHBOARD_DEAL_SIZE_DATA",
      details: `User ${req.user.id} fetched dashboard deal size data`,
      ip_address: req.ip,
    });
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

const getDashboardDealConsultantStatusData = async (req, res) => {
  try {
    // Fetch deals grouped by status
    const dealsByStatus = await Deal.findAll({
      attributes: [
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["status"],
    });

    // Fetch deals grouped by consultant name and status
    const dealsByConsultantAndStatus = await Deal.findAll({
      attributes: [
        "consultant_name",
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("deal_id")), "count"],
      ],
      group: ["consultant_name", "status"],
    });

    // Fetch total deals
    const totalDeals = await Deal.count();

    // Calculate counts and percentages for each consultant_name and status
    const dealsByConsultantAndStatusSummary = dealsByConsultantAndStatus.reduce(
      (acc, deal) => {
        const consultantName = deal.consultant_name || "Unallocated";
        const status = deal.status;
        const count = deal.get("count");

        if (!acc[consultantName]) {
          acc[consultantName] = {
            consultant_name: consultantName,
            statuses: {},
            total: 0,
          };
        }

        acc[consultantName].statuses[status] = {
          count,
          percentage: ((count / totalDeals) * 100).toFixed(2),
        };
        acc[consultantName].total += count;

        return acc;
      },
      {}
    );

    // Convert the result to an array
    const dealsByConsultantAndStatusArray = Object.values(
      dealsByConsultantAndStatusSummary
    );
    // Call createAuditLog
    await createAuditLog({
      userId: req.user.id,
      action: "FETCH_DASHBOARD_DEAL_CONSULTANT_STATUS_DATA",
      details: `User ${req.user.id} fetched dashboard deal consultant status data`,
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      data: {
        dealsByStatus,
        dealsByConsultantAndStatus: dealsByConsultantAndStatusArray,
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
  getDashboardDealConsultantStatusData,
};
