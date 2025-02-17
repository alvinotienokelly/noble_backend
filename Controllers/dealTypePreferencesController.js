// Controllers/dealTypePreferencesController.js
const db = require("../Models");
const DealTypePreferences = db.deal_type_preferences;
const User = db.users;
const { createAuditLog } = require("./auditLogService");

// Create a new deal type preference
const createDealTypePreference = async (req, res) => {
  try {
    const { deal_type } = req.body;
    const user_id = req.user.id;

    const dealTypePreference = await DealTypePreferences.create({
      user_id,
      deal_type,
    });
    await createAuditLog({
      userId: req.user.id,
      ip_address: req.ip,
      action: "CREATE_DEAL_TYPE_PREFERENCE",
      details: `Created deal type preference with deal_type: ${deal_type}`,
    });

    res.status(201).json({ status: true, dealTypePreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create multiple deal type preferences
const createMultipleDealTypePreferences = async (req, res) => {
  try {
    const { deal_types } = req.body; // Expecting an array of deal types
    const user_id = req.user.id;

    if (!Array.isArray(deal_types) || deal_types.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid deal types provided." });
    }

    const dealTypePreferences = await Promise.all(
      deal_types.map(async (deal_type) => {
        return await DealTypePreferences.create({
          user_id,
          deal_type,
        });
      })
    );

    await createAuditLog({
      userId: req.user.id,
      ip_address: req.ip,
      action: "CREATE_MULTIPLE_DEAL_TYPE_PREFERENCES",
      details: `Created multiple deal type preferences: ${deal_types.join(
        ", "
      )}`,
    });

    res.status(200).json({ status: true, dealTypePreferences });
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
    await createAuditLog({
      userId: req.user.id,
      ip_address: req.ip,
      action: "GET_DEAL_TYPE_PREFERENCES",
      details: `Fetched deal type preferences for user_id: ${user_id}`,
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
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await dealTypePreference.update({
      deal_type,
    });

    await createAuditLog({
      userId: req.user.id,
      ip_address: req.ip,
      action: "UPDATE_DEAL_TYPE_PREFERENCE",
      details: `Updated deal type preference with id: ${id} to deal_type: ${deal_type}`,
    });

    res.status(200).json({ status: true, dealTypePreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
// Get all unique deal type preferences for the logged-in user
const getUniqueDealTypePreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await DealTypePreferences.findAll({
      where: { user_id },
      attributes: [
        [
          db.sequelize.fn("DISTINCT", db.sequelize.col("deal_type")),
          "deal_type",
        ],
      ],
    });

    await createAuditLog({
      userId: req.user.id,
      ip_address: req.ip,
      action: "GET_UNIQUE_DEAL_TYPE_PREFERENCES",
      details: `Fetched unique deal type preferences for user_id: ${user_id}`,
    });

    res.status(200).json({ status: true, preferences });
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
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await dealTypePreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDealTypePreference,
  getDealTypePreferences,
  updateDealTypePreference,
  deleteDealTypePreference,
  createMultipleDealTypePreferences,
  getUniqueDealTypePreferences,
};
