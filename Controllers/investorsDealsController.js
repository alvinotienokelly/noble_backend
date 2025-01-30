// controllers/investorsDealsController.js
const { InvestorsDeals } = require("../Models");
const db = require("../Models");
const Deal = db.deals;
const User = db.users; // A
const { createAuditLog } = require("./auditLogService");

const createInvestment = async (req, res) => {
  try {
    const { investor_id, deal_id, investment_amount } = req.body;
    const newInvestment = await InvestorsDeals.create({
      investor_id,
      deal_id,
      investment_amount,
    });
    await createAuditLog({
      userId: req.user.id,
      action: "CREATE_INVESTMENT",
      description: "InvestorsDeals",
      ip_address: req.ip,
    });
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const trackInvestorBehavior = async (investorId, dealId) => {
  try {
    const investor = await User.findByPk(investorId);
    const deal = await Deal.findByPk(dealId);

    if (!investor || !deal) {
      throw new Error("Investor or Deal not found.");
    }

    // Update investor preferences based on the deal they invested in
    investor.preference_sector = investor.preference_sector || [];
    if (!investor.preference_sector.includes(deal.sector)) {
      investor.preference_sector.push(deal.sector);
    }

    investor.preference_region = investor.preference_region || [];
    if (!investor.preference_region.includes(deal.region)) {
      investor.preference_region.push(deal.region);
    }

    await investor.save();
  } catch (error) {
    console.error("Error tracking investor behavior:", error);
  }
};

const getInvestments = async (req, res) => {
  try {
    const investments = await InvestorsDeals.findAll();
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await InvestorsDeals.findByPk(id);
    if (investment) {
      res.status(200).json(investment);
    } else {
      res.status(404).json({ error: "Investment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { investment_amount } = req.body;
    const [updated] = await InvestorsDeals.update(
      { investment_amount },
      { where: { id } }
    );
    if (updated) {
      const updatedInvestment = await InvestorsDeals.findByPk(id);
      res.status(200).json(updatedInvestment);
    } else {
      res.status(404).json({ error: "Investment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InvestorsDeals.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Investment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
  trackInvestorBehavior,
};
