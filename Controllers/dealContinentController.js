// Controllers/dealContinentController.js
const db = require("../Models");
const DealContinent = db.deal_continents;
const Deal = db.deals;
const Continent = db.continents;

// Add a continent to a deal
const addContinentToDeal = async (req, res) => {
  try {
    const { deal_id, continent_id } = req.body;

    const deal = await Deal.findByPk(deal_id);
    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found." });
    }

    const continent = await Continent.findByPk(continent_id);
    if (!continent) {
      return res.status(404).json({ status: false, message: "Continent not found." });
    }

    const dealContinent = await DealContinent.create({
      deal_id,
      continent_id,
    });

    res.status(201).json({ status: true, dealContinent });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all continents for a deal
const getContinentsForDeal = async (req, res) => {
  try {
    const { deal_id } = req.params;

    const deal = await Deal.findByPk(deal_id, {
      include: [{ model: Continent, as: "continents" }],
    });

    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found." });
    }

    res.status(200).json({ status: true, continents: deal.continents });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Remove a continent from a deal
const removeContinentFromDeal = async (req, res) => {
  try {
    const { deal_id, continent_id } = req.body;

    const dealContinent = await DealContinent.findOne({
      where: { deal_id, continent_id },
    });

    if (!dealContinent) {
      return res.status(404).json({ status: false, message: "Association not found." });
    }

    await dealContinent.destroy();
    res.status(200).json({ status: true, message: "Continent removed from deal successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addContinentToDeal,
  getContinentsForDeal,
  removeContinentFromDeal,
};