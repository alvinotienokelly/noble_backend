// Controllers/sectorPreferenceController.js
const db = require("../Models");
const SectorPreference = db.sector_preferences;
const User = db.users;
const Sector = db.sectors;

// Create a new sector preference
const createSectorPreference = async (req, res) => {
  try {
    const { sector_id } = req.body;
    const user_id = req.user.id;

    const sectorPreference = await SectorPreference.create({
      user_id,
      sector_id,
    });

    res.status(201).json({ status: true, sectorPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all sector preferences for the logged-in user
const getSectorPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await SectorPreference.findAll({
      where: { user_id },
      include: [{ model: Sector, as: "sector" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a sector preference by ID
const updateSectorPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { sector_id } = req.body;

    const sectorPreference = await SectorPreference.findByPk(id);
    if (!sectorPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await sectorPreference.update({
      sector_id,
    });

    res.status(200).json({ status: true, sectorPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a sector preference by ID
const deleteSectorPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const sectorPreference = await SectorPreference.findByPk(id);
    if (!sectorPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await sectorPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Bulk create sector preferences
const bulkCreateSectorPreferences = async (req, res) => {
  try {
    const { sector_ids } = req.body;
    const user_id = req.user.id;

    if (!Array.isArray(sector_ids) || sector_ids.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid sector IDs provided." });
    }

    await SectorPreference.destroy({
      where: { user_id },
    });

    const sectorPreferences = await Promise.all(
      sector_ids.map(async (sector_id) => {
        return await SectorPreference.create({
          user_id,
          sector_id,
        });
      })
    );

    res.status(201).json({ status: true, sectorPreferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSectorPreference,
  getSectorPreferences,
  updateSectorPreference,
  deleteSectorPreference,
  bulkCreateSectorPreferences, // Add this line
};
