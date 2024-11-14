// server.js
const express = require("express");
const { Sequelize } = require("sequelize");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const db = require("./Models");
const userRoutes = require("./Routes/userRoutes");
const dealRoutes = require("./Routes/dealRoutes");
const documentRoutes = require("./Routes/documentRoutes");
const transactionRoutes = require("./Routes/transactionRoutes");
const auditLogRoutes = require("./Routes/auditLogRoutes");
const investorsDealsRoutes = require("./Routes/investorsDealsRouter");
const teamsRoutes = require("./Routes/teamsRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const milestoneRoutes = require("./Routes/milestoneRoutes");
const dealAccessInviteRoutes = require("./Routes/dealAccessInviteRoutes");
const { sendTaskReminders } = require("./Controllers/taskController");
const commissionRoutes = require("./Routes/commissionRoutes");
const folderRoutes = require("./Routes/folderRoutes");

const docusignWebhookRoutes = require("./Routes/docusignWebhookRoutes");
const { sendPredictiveNotifications } = require("./Controllers/notificationController");

const cron = require("node-cron");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.sequelize.sync({ force: false }).then(() => {
  console.log("db has been re sync");
});

app.use("/api/users", userRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/investors-deals", investorsDealsRoutes);
app.use("/api/noble-teams", teamsRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/deal-access-invites", dealAccessInviteRoutes);
app.use("/api/docusign", docusignWebhookRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/folders", folderRoutes);


app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));

// Schedule task reminders to be sent every day at 8 AM
cron.schedule("0 8 * * *", () => {
  sendTaskReminders();
});


cron.schedule("0 9 * * *", () => {
  sendPredictiveNotifications();
});
