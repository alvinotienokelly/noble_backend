// Controllers/countryController.js
const db = require("../Models");
const Country = db.country;

// Get all countries
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.status(200).json({ status: true, countries });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get country by ID
const getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ status: false, message: "Country not found." });
    }
    res.status(200).json({ status: true, country });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Filter countries by name or code
const filterCountries = async (req, res) => {
  try {
    const { name, code, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (name) {
      whereClause.name = { [db.Sequelize.Op.iLike]: `%${name}%` }; // Case-insensitive search
    }
    if (code) {
      whereClause.code = { [db.Sequelize.Op.iLike]: `%${code}%` }; // Case-insensitive search
    }

    const { count: totalCountries, rows: countries } = await Country.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalCountries / limit);

    res.status(200).json({
      status: true,
      totalCountries,
      totalPages,
      currentPage: parseInt(page),
      countries,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new country
const createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const country = await Country.create({ name, code });
    res.status(201).json({ status: true, country });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a country
const updateCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ status: false, message: "Country not found." });
    }
    await country.update(req.body);
    res.status(200).json({ status: true, country });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a country
const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ status: false, message: "Country not found." });
    }
    await country.destroy();
    res.status(200).json({ status: true, message: "Country deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  filterCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};