// Controllers/notificationController.js
const db = require("../Models");
const Notification = db.notifications;
const User = db.users;
const { recommendDeals } = require("./dealController");
const { sendEmail } = require("../Middlewares/emailService");
const { createAuditLog } = require("./auditLogService");

// Create a new notification
const createNotification = async (userId, title, message) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
    });

    // await createAuditLog({
    //   userId,
    //   action: "CREATE_NOTIFICATION",
    //   details: `Notification titled "${title}" created for user ID ${userId}`,
    // });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalNotifications, rows: notifications } =
      await Notification.findAndCountAll({
        where: { user_id: req.user.id },
        order: [["createdAt", "DESC"]],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalNotifications / limit);

    await createAuditLog({
      ip_address: req.ip,
      userId: req.user.id,
      action: "GET_USER_NOTIFICATIONS",
      description: `User ID ${req.user.id} retrieved their notifications.`,
    });
    res.status(200).json({
      status: "true",
      totalNotifications,
      totalPages,
      currentPage: parseInt(page),
      notifications,
    });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res
        .status(404)
        .json({ status: "false", message: "Notification not found." });
    }

    if (notification.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ status: "false", message: "Access denied." });
    }

    notification.read = true;
    await notification.save();
    await createAuditLog({
      ip_address: req.ip,
      userId: req.user.id,
      action: "MARK_NOTIFICATION_AS_READ",
      description: `Notification ID ${req.params.id} marked as read by user ID ${req.user.id}.`,
    });

    res.status(200).json({ status: "true", notification });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

const sendPredictiveNotifications = async () => {
  try {
    const investors = await User.findAll();

    for (const investor of investors) {
      const recommendedDeals = await recommendDeals(investor.id);

      if (recommendedDeals.length > 0) {
        const emailSubject = "Recommended Deals for You";
        const emailBody = `Hello ${
          investor.name
        },\n\nBased on your preferences and behavior, we have found some deals that might interest you:\n\n${recommendedDeals
          .map((deal) => `- ${deal.title} (${deal.sector}, ${deal.region})`)
          .join("\n")}\n\nBest regards,\nYour Team`;

        await sendEmail(investor.email, emailSubject, emailBody);
      }
    }
  } catch (error) {
    console.error("Error sending predictive notifications:", error);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  sendPredictiveNotifications,
};
