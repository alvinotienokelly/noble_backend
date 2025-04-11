// Controllers/subsectorController.js
const db = require("../Models");
const Subsector = db.subsectors;

// Get all subsectors
const getAllSubsectors = async (req, res) => {
  try {
    const subsectors = await Subsector.findAll();
    res.status(200).json({ status: true, subsectors });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get subsector by ID
const getSubsectorById = async (req, res) => {
  try {
    const subsector = await Subsector.findByPk(req.params.id);
    if (!subsector) {
      return res
        .status(404)
        .json({ status: false, message: "Subsector not found." });
    }
    res.status(200).json({ status: true, subsector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all subsectors by sector_id
const getSubsectorBySectorId = async (req, res) => {
  try {
    const { sector_id } = req.params;

    // Find all subsectors that belong to the given sector_id
    const subsectors = await Subsector.findAll({
      where: { sector_id },
    });

    if (!subsectors || subsectors.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No subsectors found for the specified sector ID.",
      });
    }

    res.status(200).json({
      status: true,
      subsectors: subsectors,
    });
  } catch (error) {
    console.error("Error fetching subsectors by sector ID:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new subsector
const createSubsector = async (req, res) => {
  try {
    const { name, sector_id } = req.body;
    const subsector = await Subsector.create({ name, sector_id });
    res.status(201).json({ status: true, subsector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a subsector
const updateSubsector = async (req, res) => {
  try {
    const subsector = await Subsector.findByPk(req.params.id);
    if (!subsector) {
      return res
        .status(404)
        .json({ status: false, message: "Subsector not found." });
    }
    await subsector.update(req.body);
    res.status(200).json({ status: true, subsector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a subsector
const deleteSubsector = async (req, res) => {
  try {
    const subsector = await Subsector.findByPk(req.params.id);
    if (!subsector) {
      return res
        .status(404)
        .json({ status: false, message: "Subsector not found." });
    }
    await subsector.destroy();
    res
      .status(200)
      .json({ status: true, message: "Subsector deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllSubsectors,
  getSubsectorById,
  createSubsector,
  updateSubsector,
  deleteSubsector,
  getSubsectorBySectorId, // Add this line
};
