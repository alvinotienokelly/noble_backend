// Controllers/dashboardController.js
const db = require("../Models");
const Deal = db.deals;
const User = db.users;
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

module.exports = {
  getDashboardDealStatusData,
  getDashboardDealTypeData,
};
