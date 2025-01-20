// Controllers/regionController.js
const db = require("../Models");
const Region = db.regions;
const Continent = db.continents;

// Create a new region
const createRegion = async (req, res) => {
  try {
    const { name, continent_id } = req.body;

    const continent = await Continent.findByPk(continent_id);
    if (!continent) {
      return res
        .status(404)
        .json({ status: false, message: "Continent not found." });
    }

    const region = await Region.create({
      name,
      continent_id,
    });

    res.status(201).json({ status: true, region });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all regions
const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll({
      include: [{ model: Continent, as: "continent" }],
    });
    res.status(200).json({ status: true, regions });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a region by ID
const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, continent_id } = req.body;

    const region = await Region.findByPk(id);
    if (!region) {
      return res
        .status(404)
        .json({ status: false, message: "Region not found." });
    }

    const continent = await Continent.findByPk(continent_id);
    if (!continent) {
      return res
        .status(404)
        .json({ status: false, message: "Continent not found." });
    }

    await region.update({
      name,
      continent_id,
    });

    res.status(200).json({ status: true, region });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a region by ID
const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findByPk(id);
    if (!region) {
      return res
        .status(404)
        .json({ status: false, message: "Region not found." });
    }

    await region.destroy();
    res
      .status(200)
      .json({ status: true, message: "Region deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createRegion,
  getAllRegions,
  updateRegion,
  deleteRegion,
};
