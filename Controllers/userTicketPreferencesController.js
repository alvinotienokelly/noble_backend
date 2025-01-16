// Controllers/userTicketPreferencesController.js
const db = require("../Models");
const UserTicketPreferences = db.user_ticket_preferences;
const User = db.users;

// Create a new user ticket preference
const createUserTicketPreference = async (req, res) => {
  try {
    const { ticket_size_min, ticket_size_max } = req.body;
    const user_id = req.user.id;

    const userTicketPreference = await UserTicketPreferences.create({
      user_id,
      ticket_size_min,
      ticket_size_max,
    });

    res.status(201).json({ status: true, userTicketPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all ticket preferences for the logged-in user
const getUserTicketPreferences = async (req, res) => {
  try {
    const user_id = req.user.id;
    const preferences = await UserTicketPreferences.findAll({
      where: { user_id },
      include: [{ model: User, as: "user" }],
    });
    res.status(200).json({ status: true, preferences });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a user ticket preference by ID
const updateUserTicketPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticket_size_min, ticket_size_max } = req.body;

    const userTicketPreference = await UserTicketPreferences.findByPk(id);
    if (!userTicketPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await userTicketPreference.update({
      ticket_size_min,
      ticket_size_max,
    });

    res.status(200).json({ status: true, userTicketPreference });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a user ticket preference by ID
const deleteUserTicketPreference = async (req, res) => {
  try {
    const { id } = req.params;

    const userTicketPreference = await UserTicketPreferences.findByPk(id);
    if (!userTicketPreference) {
      return res
        .status(404)
        .json({ status: false, message: "Preference not found." });
    }

    await userTicketPreference.destroy();
    res
      .status(200)
      .json({ status: true, message: "Preference deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUserTicketPreference,
  getUserTicketPreferences,
  updateUserTicketPreference,
  deleteUserTicketPreference,
};
