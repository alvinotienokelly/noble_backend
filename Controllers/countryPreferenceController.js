// Controllers/countryPreferenceController.js
const db = require("../Models");
const CountryPreference = db.country_preferences;
const User = db.users;
const Country = db.country;

// Create a new continent preference
const createCountryPreference = async (req, res) => {
  try {
    const { country_id } = req.body;
    const user_id = req.user.id;

    const preference = await CountryPreference.create({
      user_id,
      country_id,
    });

    res.status(201).json({ status: true, preference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all continent preferences for the logged-in user
const getCountryPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await CountryPreference.findAll({
      where: { user_id },
      include: [{ model: Country, as: "country" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a continent preference by ID
const updateCountryPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { country_id } = req.body;

    const preference = await CountryPreference.findByPk(id);
    if (!preference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await preference.update({
      country_id,
    });

    res.status(200).json({ status: true, preference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a continent preference by ID
const deleteCountryPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const preference = await CountryPreference.findByPk(id);
    if (!preference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await preference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createCountryPreference,
  getCountryPreferences,
  updateCountryPreference,
  deleteCountryPreference,
};
