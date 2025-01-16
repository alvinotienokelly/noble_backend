// Controllers/primaryLocationPreferencesController.js
const db = require("../Models");
const PrimaryLocationPreferences = db.primary_location_preferences;
const User = db.users;
const Country = db.country;

// Create a new primary location preference
const createPrimaryLocationPreference = async (req, res) => {
  try {
    const { continent, country_id, region } = req.body;
    const user_id = req.user.id;

    const primaryLocationPreference = await PrimaryLocationPreferences.create({
      user_id,
      continent,
      country_id,
      region,
    });

    res.status(201).json({ status: true, primaryLocationPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all primary location preferences for the logged-in user
const getPrimaryLocationPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await PrimaryLocationPreferences.findAll({
      where: { user_id },
      include: [
        { model: User, as: "user" },
        { model: Country, as: "country" },
      ],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a primary location preference by ID
const updatePrimaryLocationPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { continent, country_id, region } = req.body;

    const primaryLocationPreference = await PrimaryLocationPreferences.findByPk(
      id
    );
    if (!primaryLocationPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await primaryLocationPreference.update({
      continent,
      country_id,
      region,
    });

    res.status(200).json({ status: true, primaryLocationPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a primary location preference by ID
const deletePrimaryLocationPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const primaryLocationPreference = await PrimaryLocationPreferences.findByPk(
      id
    );
    if (!primaryLocationPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await primaryLocationPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createPrimaryLocationPreference,
  getPrimaryLocationPreferences,
  updatePrimaryLocationPreference,
  deletePrimaryLocationPreference,
};
