// Controllers/continentController.js
const db = require("../Models");
const Continent = db.continents;

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
      return res.status(404).json({ status: false, message: "Continent not found." });
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
      return res.status(404).json({ status: false, message: "Continent not found." });
    }

    await continent.destroy();
    res.status(200).json({ status: true, message: "Continent deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createContinent,
  getAllContinents,
  updateContinent,
  deleteContinent,
};