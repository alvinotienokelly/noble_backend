// controllers/investorsDealsController.js
const { InvestorsDeals } = require("../Models");

const createInvestment = async (req, res) => {
  try {
    const { investor_id, deal_id, investment_amount } = req.body;
    const newInvestment = await InvestorsDeals.create({
      investor_id,
      deal_id,
      investment_amount,
    });
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
};
