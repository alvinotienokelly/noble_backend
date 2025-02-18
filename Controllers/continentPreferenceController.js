// Controllers/continentPreferenceController.js
const db = require("../Models");
const ContinentPreference = db.continent_preferences;
const User = db.users;
const Continent = db.continents;

// Create a new continent preference
const createContinentPreference = async (req, res) => {
  try {
    const { continent_id } = req.body;
    const user_id = req.user.id;

    const continentPreference = await ContinentPreference.create({
      user_id,
      continent_id,
    });

    res.status(201).json({ status: true, continentPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserContinentPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;

    const preferences = await ContinentPreference.findAll({
      where: { user_id: user_id },
      include: [{ model: Continent, as: "continent" }],
    });

    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all continent preferences for the logged-in user
const getContinentPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await ContinentPreference.findAll({
      where: { user_id },
      include: [{ model: Continent, as: "continent" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a continent preference by ID
const updateContinentPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { continent_id } = req.body;

    const continentPreference = await ContinentPreference.findByPk(id);
    if (!continentPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await continentPreference.update({
      continent_id,
    });

    res.status(200).json({ status: true, continentPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a continent preference by ID
const deleteContinentPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const continentPreference = await ContinentPreference.findByPk(id);
    if (!continentPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await continentPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Bulk create continent preferences
const bulkCreateContinentPreferences = async (req, res) => {
  try {
    const { continent_ids } = req.body;
    const user_id = req.user.id;

    if (!Array.isArray(continent_ids) || continent_ids.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid continent IDs provided." });
    }

    await ContinentPreference.destroy({
      where: { user_id },
    });

    const continentPreferences = await Promise.all(
      continent_ids.map(async (continent_id) => {
        return await ContinentPreference.create({
          user_id,
          continent_id,
        });
      })
    );

    res.status(200).json({ status: true, continentPreferences });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  createContinentPreference,
  getContinentPreferences,
  updateContinentPreference,
  deleteContinentPreference,
  getUserContinentPreferences,
  bulkCreateContinentPreferences,
};
