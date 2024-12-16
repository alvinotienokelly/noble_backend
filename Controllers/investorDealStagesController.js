// Controllers/investorDealStagesController.js
const db = require("../Models");
const InvestorDealStages = db.investor_deal_stages;
const DealStage = db.deal_stages;
const User = db.users;
const Deal = db.deals;

const updateInvestorDealStage = async (req, res) => {
  try {
    const { investor_id, deal_id, stage_id } = req.body;

    const investment = await InvestorDealStages.findOne({
      where: { investor_id, deal_id },
    });

    if (!investment) {
      return res.status(404).json({ status: false, message: "Investment not found." });
    }

    const stage = await DealStage.findByPk(stage_id);
    if (!stage) {
      return res.status(404).json({ status: false, message: "Deal stage not found." });
    }

    investment.stage_id = stage_id;
    await investment.save();

    res.status(200).json({ status: true, investment });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const addInvestorToDealStage = async (req, res) => {
  try {
    const { investor_id, deal_id, stage_id } = req.body;

    const investment = await InvestorDealStages.create({
      investor_id,
      deal_id,
      stage_id,
    });

    res.status(201).json({ status: true, investment });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  updateInvestorDealStage,
  addInvestorToDealStage,
};