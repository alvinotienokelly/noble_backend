// Controllers/userTicketPreferencesController.js
const db = require("../Models");
const UserTicketPreferences = db.user_ticket_preferences;
const User = db.users;
const { createNotification } = require("./notificationController");
const { createAuditLog } = require("./auditLogService");

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
    await createNotification(
      user_id,
      "User Ticket Preference",
      "Your ticket preference has been updated."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Create_User_Ticket_Preference",
      details: `User ticket preference created with ID: ${userTicketPreference.id}`,
      ip_address: req.ip,
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
    await createNotification(
      user_id,
      "User Ticket Preferences",
      "Your ticket preferences have been retrieved."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Get_User_Ticket_Preferences",
      details: `User ticket preferences retrieved for user ID: ${user_id}`,
      ip_address: req.ip,
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

    await createNotification(
      req.user.id,
      "User Ticket Preference",
      "Your ticket preference has been updated."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Update_User_Ticket_Preference",
      details: `User ticket preference updated with ID: ${id}`,
      ip_address: req.ip,
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

    await createNotification(
      req.user.id,
      "User Ticket Preference",
      "Your ticket preference has been deleted."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Delete_User_Ticket_Preference",
      details: `User ticket preference deleted with ID: ${id}`,
      ip_address: req.ip,
    });
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
