// Controllers/dealTypePreferencesController.js
const db = require("../Models");
const DealTypePreferences = db.deal_type_preferences;
const User = db.users;

// Create a new deal type preference
const createDealTypePreference = async (req, res) => {
  try {
    const { deal_type } = req.body;
    const user_id = req.user.id;

    const dealTypePreference = await DealTypePreferences.create({
      user_id,
      deal_type,
    });

    res.status(201).json({ status: true, dealTypePreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all deal type preferences for the logged-in user
const getDealTypePreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await DealTypePreferences.findAll({
      where: { user_id },
      include: [{ model: User, as: "user" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a deal type preference by ID
const updateDealTypePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { deal_type } = req.body;

    const dealTypePreference = await DealTypePreferences.findByPk(id);
    if (!dealTypePreference) {
      return res.status(404).json({ status: false, message: "Preference not found." });
    }

    await dealTypePreference.update({
      deal_type,
    });

    res.status(200).json({ status: true, dealTypePreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a deal type preference by ID
const deleteDealTypePreference = async (req, res) => {
  try {
    const { id } = req.params;

    const dealTypePreference = await DealTypePreferences.findByPk(id);
    if (!dealTypePreference) {
      return res.status(404).json({ status: false, message: "Preference not found." });
    }

    await dealTypePreference.destroy();
    res.status(200).json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDealTypePreference,
  getDealTypePreferences,
  updateDealTypePreference,
  deleteDealTypePreference,
};