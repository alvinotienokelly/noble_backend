// Controllers/regionPreferenceController.js
const db = require("../Models");
const RegionPreference = db.region_preferences;
const User = db.users;
const Region = db.regions;

// Create a new region preference
const createRegionPreference = async (req, res) => {
  try {
    const { region_id } = req.body;
    const user_id = req.user.id;

    const regionPreference = await RegionPreference.create({
      user_id,
      region_id,
    });

    res.status(201).json({ status: true, regionPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all region preferences for the logged-in user
const getRegionPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await RegionPreference.findAll({
      where: { user_id },
      include: [{ model: Region, as: "region" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a region preference by ID
const updateRegionPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { region_id } = req.body;

    const regionPreference = await RegionPreference.findByPk(id);
    if (!regionPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await regionPreference.update({
      region_id,
    });

    res.status(200).json({ status: true, regionPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a region preference by ID
const deleteRegionPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const regionPreference = await RegionPreference.findByPk(id);
    if (!regionPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await regionPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createRegionPreference,
  getRegionPreferences,
  updateRegionPreference,
  deleteRegionPreference,
};
