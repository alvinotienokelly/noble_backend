// Controllers/sectorController.js
const db = require("../Models");
const Sector = db.sectors;

// Get all sectors
const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    res.status(200).json({ status: true, sectors });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get sector by ID
const getSectorById = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    res.status(200).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new sector
const createSector = async (req, res) => {
  try {
    const { name } = req.body;
    const sector = await Sector.create({ name });
    res.status(201).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a sector
const updateSector = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    await sector.update(req.body);
    res.status(200).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a sector
const deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    await sector.destroy();
    res
      .status(200)
      .json({ status: true, message: "Sector deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
};
