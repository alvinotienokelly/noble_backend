// Controllers/subSectorPreferenceController.js
const db = require("../Models");
const SubSectorPreference = db.sub_sector_preferences;
const User = db.users;
const SubSector = db.subsectors;

// Create a new sub-sector preference
const createSubSectorPreference = async (req, res) => {
  try {
    const { sub_sector_id } = req.body;
    const user_id = req.user.id;

    const subSectorPreference = await SubSectorPreference.create({
      user_id,
      sub_sector_id,
    });

    res.status(201).json({ status: true, subSectorPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all sub-sector preferences for the logged-in user
const getSubSectorPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await SubSectorPreference.findAll({
      where: { user_id },
      include: [{ model: SubSector, as: "subSector" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a sub-sector preference by ID
const updateSubSectorPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { sub_sector_id } = req.body;

    const subSectorPreference = await SubSectorPreference.findByPk(id);
    if (!subSectorPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await subSectorPreference.update({
      sub_sector_id,
    });

    res.status(200).json({ status: true, subSectorPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a sub-sector preference by ID
const deleteSubSectorPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const subSectorPreference = await SubSectorPreference.findByPk(id);
    if (!subSectorPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await subSectorPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSubSectorPreference,
  getSubSectorPreferences,
  updateSubSectorPreference,
  deleteSubSectorPreference,
};
