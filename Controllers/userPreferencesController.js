// Controllers/userPreferencesController.js
const db = require("../Models");
const UserPreferences = db.user_preferences;
const User = db.users;
const Sector = db.sectors;

// Create a new user preference
const createUserPreference = async (req, res) => {
  try {
    const { sector_id } = req.body;
    const user_id = req.user.id;

    const userPreference = await UserPreferences.create({
      user_id,
      sector_id,
    });

    res.status(201).json({ status: true, userPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all preferences for the logged-in user
const getUserPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await UserPreferences.findAll({
      where: { user_id },
      include: [{ model: Sector, as: "sector" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a user preference by ID
const updateUserPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { sector_id } = req.body;

    const userPreference = await UserPreferences.findByPk(id);
    if (!userPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await userPreference.update({
      sector_id,
    });

    res.status(200).json({ status: true, userPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a user preference by ID
const deleteUserPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const userPreference = await UserPreferences.findByPk(id);
    if (!userPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await userPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUserPreference,
  getUserPreferences,
  updateUserPreference,
  deleteUserPreference,
};
