// Controllers/notificationController.js
const db = require("../Models");
const Notification = db.notifications;
const User = db.users;
const { recommendDeals } = require("./dealController");
const { sendEmail } = require("../Middlewares/emailService");

// Create a new notification
const createNotification = async (userId, title, message) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ status: "true", notifications });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ status: "false", message: "Notification not found." });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ status: "false", message: "Access denied." });
    }

    notification.read = true;
    await notification.save();

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
        const emailBody = `Hello ${investor.name},\n\nBased on your preferences and behavior, we have found some deals that might interest you:\n\n${recommendedDeals
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