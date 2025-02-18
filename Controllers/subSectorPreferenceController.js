// Controllers/subSectorPreferenceController.js
const db = require("../Models");
const SubSectorPreference = db.sub_sector_preferences;
const User = db.users;
const SubSector = db.subsectors;
const { createNotification } = require("./notificationController");

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
// Bulk create sub-sector preferences
const bulkCreateSubSectorPreferences = async (req, res) => {
  try {
    const { sub_sector_ids } = req.body;
    const user_id = req.user.id;

    if (!Array.isArray(sub_sector_ids) || sub_sector_ids.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid sub-sector IDs provided." });
    }

    await SubSectorPreference.destroy({
      where: { user_id },
    });

    const subSectorPreferences = await Promise.all(
      sub_sector_ids.map(async (sub_sector_id) => {
        return await SubSectorPreference.create({
          user_id,
          sub_sector_id,
        });
      })
    );
    await createNotification(
      user_id,
      "created sub sector preferences",
      "Your sub sector preferences have been updated."
    );
    res.status(200).json({ status: true, subSectorPreferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSubSectorPreference,
  getSubSectorPreferences,
  updateSubSectorPreference,
  deleteSubSectorPreference,
  bulkCreateSubSectorPreferences,
};
