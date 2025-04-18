// Controllers/dealRegionController.js
const db = require("../Models");
const DealRegion = db.deal_regions;
const Deal = db.deals;
const Region = db.regions;
const { createAuditLog } = require("./auditLogService");
// Add a region to a deal
const addRegionToDeal = async (req, res) => {
  try {
    const { deal_id, region_id } = req.body;

    const deal = await Deal.findByPk(deal_id);
    if (!deal) {
      return res
        .status(404)
        .json({ status: false, message: "Deal not found." });
    }

    const region = await Region.findByPk(region_id);

    if (!region) {
      return res
        .status(404)
        .json({ status: false, message: "Region not found." });
    }

    const dealRegion = await DealRegion.create({
      deal_id,
      region_id,
    });
    await createAuditLog({
      userId: req.user.id,
      action: "Create_Deal_Region",
      details: `User created a region for deal with id ${deal_id}`,
      ip_address: req.ip,
    });
    res.status(201).json({ status: true, dealRegion });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all regions for a deal
const getRegionsForDeal = async (req, res) => {
  try {
    const { deal_id } = req.params;

    const deal = await Deal.findByPk(deal_id, {
      include: [{ model: Region, as: "regions" }],
    });

    if (!deal) {
      return res
        .status(404)
        .json({ status: false, message: "Deal not found." });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "Get_Deal_Regions",
      details: `User retrieved regions for deal with id ${deal_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, regions: deal.regions });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Remove a region from a deal
const removeRegionFromDeal = async (req, res) => {
  try {
    const { deal_id, region_id } = req.body;

    const dealRegion = await DealRegion.findOne({
      where: { deal_id, region_id },
    });

    if (!dealRegion) {
      return res
        .status(404)
        .json({ status: false, message: "Association not found." });
    }

    await dealRegion.destroy();
    await createAuditLog({
      userId: req.user.id,
      action: "Remove_Deal_Region",
      details: `User removed region with id ${region_id} from deal with id ${deal_id}`,
      ip_address: req.ip,
    });
    res.status(200).json({
      status: true,
      message: "Region removed from deal successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addRegionToDeal,
  getRegionsForDeal,
  removeRegionFromDeal,
};
