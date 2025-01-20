// Controllers/dealCountryController.js
const db = require("../Models");
const DealCountry = db.deal_countries;
const Deal = db.deals;
const Country = db.countries;

// Add a country to a deal
const addCountryToDeal = async (req, res) => {
  try {
    const { deal_id, country_id } = req.body;

    const deal = await Deal.findByPk(deal_id);
    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found." });
    }

    const country = await Country.findByPk(country_id);
    if (!country) {
      return res.status(404).json({ status: false, message: "Country not found." });
    }

    const dealCountry = await DealCountry.create({
      deal_id,
      country_id,
    });

    res.status(201).json({ status: true, dealCountry });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all countries for a deal
const getCountriesForDeal = async (req, res) => {
  try {
    const { deal_id } = req.params;

    const deal = await Deal.findByPk(deal_id, {
      include: [{ model: Country, as: "countries" }],
    });

    if (!deal) {
      return res.status(404).json({ status: false, message: "Deal not found." });
    }

    res.status(200).json({ status: true, countries: deal.countries });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Remove a country from a deal
const removeCountryFromDeal = async (req, res) => {
  try {
    const { deal_id, country_id } = req.body;

    const dealCountry = await DealCountry.findOne({
      where: { deal_id, country_id },
    });

    if (!dealCountry) {
      return res.status(404).json({ status: false, message: "Association not found." });
    }

    await dealCountry.destroy();
    res.status(200).json({ status: true, message: "Country removed from deal successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addCountryToDeal,
  getCountriesForDeal,
  removeCountryFromDeal,
};