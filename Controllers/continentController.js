// Controllers/continentController.js
const db = require("../Models");
const Continent = db.continents;
const Country = db.country;
const Region = db.regions;

// Create a new continent
const createContinent = async (req, res) => {
  try {
    const { name } = req.body;

    const continent = await Continent.create({
      name,
    });

    res.status(201).json({ status: true, continent });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all continents
const getAllContinents = async (req, res) => {
  try {
    const continents = await Continent.findAll();
    res.status(200).json({ status: true, continents });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a continent by ID
const updateContinent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const continent = await Continent.findByPk(id);
    if (!continent) {
      return res
        .status(404)
        .json({ status: false, message: "Continent not found." });
    }

    await continent.update({
      name,
    });

    res.status(200).json({ status: true, continent });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a continent by ID
const deleteContinent = async (req, res) => {
  try {
    const { id } = req.params;

    const continent = await Continent.findByPk(id);
    if (!continent) {
      return res
        .status(404)
        .json({ status: false, message: "Continent not found." });
    }

    await continent.destroy();
    res
      .status(200)
      .json({ status: true, message: "Continent deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getContinentWithCountries = async (req, res) => {
  const continent = await Continent.findByPk(req.params.id, {
    include: [{ model: Country, as: "countries" }],
  });
  res.status(200).json({ status: true, continent });
};

const getContinentWithRegions = async (req, res) => {
  const continent = await Continent.findByPk(req.params.id, {
    include: [{ model: Region, as: "regions" }],
  });
  res.status(200).json({ status: true, continent });
};

module.exports = {
  createContinent,
  getAllContinents,
  updateContinent,
  deleteContinent,
  getContinentWithCountries,
  getContinentWithRegions,
};
