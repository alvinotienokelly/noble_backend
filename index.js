// server.js
const multer = require("multer");
const express = require("express");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const cors = require("cors");
const fileUpload = require("express-fileupload");
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
const folderAccessInviteRoutes = require("./Routes/folderAccessInviteRoutes");
const socialAccountTypeRoutes = require("./Routes/socialAccountTypeRoutes");
const docusignWebhookRoutes = require("./Routes/docusignWebhookRoutes");
const {
  sendPredictiveNotifications,
} = require("./Controllers/notificationController");
const cron = require("node-cron");
const userReviewRoutes = require("./Routes/userReviewRoutes");
const contactPersonRoutes = require("./Routes/contactPersonRoutes");
const dealStageRoutes = require("./Routes/dealStageRoutes");
const investorDealStagesRoutes = require("./Routes/investorDealStagesRoutes");
const countryRoutes = require("./Routes/countryRoutes"); // Add this line
const roleRoutes = require("./Routes/roleRoutes"); // Add this line
const permissionRoutes = require("./Routes/permissionRoutes"); // Add this line
const sectorRoutes = require("./Routes/sectorRoutes");
const subsectorRoutes = require("./Routes/subsectorRoutes"); // Add this line
const dashboardRoutes = require("./Routes/dashboardRoutes");
const userPreferencesRoutes = require("./Routes/userPreferencesRoutes");
const userTicketPreferencesRoutes = require("./Routes/userTicketPreferencesRoutes");
const dealTypePreferencesRoutes = require("./Routes/dealTypePreferencesRoutes");
const primaryLocationPreferencesRoutes = require("./Routes/primaryLocationPreferencesRoutes");
const documentShareRoutes = require("./Routes/documentShareRoutes");
const continentRoutes = require("./Routes/continentRoutes");
const dealContinentRoutes = require("./Routes/dealContinentRoutes");
const regionRoutes = require("./Routes/regionRoutes");
const dealRegionRoutes = require("./Routes/dealRegionRoutes");
const subfolderRoutes = require("./Routes/subfolderRoutes");
const pipelineRoutes = require("./Routes/pipelineRoutes");
const pipelineStageRoutes = require("./Routes/pipelineStageRoutes");
const stageCardRoutes = require("./Routes/stageCardRoutes");
const subfolderAccessInviteRoutes = require("./Routes/subfolderAccessInviteRoutes");
const socialMediaAccountRoutes = require("./Routes/socialMediaAccountRoutes");
const investorMilestoneRoutes = require("./Routes/investorMilestoneRoutes");
const investorMilestoneStatusRoutes = require("./Routes/investorMilestoneStatusRoutes");
const dealMilestoneRoutes = require("./Routes/dealMilestoneRoutes");
const dealMilestoneStatusRoutes = require("./Routes/dealMilestoneStatusRoutes");
const documentTypeRoutes = require("./Routes/documentTypeRoutes");
const sectorPreferenceRoutes = require("./Routes/sectorPreferenceRoutes");
const subSectorPreferenceRoutes = require("./Routes/subSectorPreferenceRoutes");
const continentPreferenceRoutes = require("./Routes/continentPreferenceRoutes");
const regionPreferenceRoutes = require("./Routes/regionPreferenceRoutes");
const countryPreferenceRoutes = require("./Routes/countryPreferencesRoutes");
const emailRoutes = require("./Routes/emailRoutes");
const swaggerSpec = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");
const settingsRoutes = require("./Routes/settingsRoutes");

const path = require("path");

require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const PORT = process.env.PORT || 8080;

const app = express();

/ Allow specific origins
const allowedOrigins = [
  "https://dealflow.noblestride.co.ke", // Frontend origin
  "https://another-allowed-origin.com", // Add other allowed origins if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true, // Allow cookies and credentials to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.sequelize.sync({ force: false }).then(() => {
  console.log("db has been re sync");
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use("/api/folder-access-invites", folderAccessInviteRoutes);
app.use("/api/social-account-types", socialAccountTypeRoutes);
app.use("/api/user-reviews", userReviewRoutes);
app.use("/api/contact-persons", contactPersonRoutes);
app.use("/api/deal-stages", dealStageRoutes);
app.use("/api/investor-deal-stages", investorDealStagesRoutes);
app.use("/api/countries", countryRoutes); // Add this line
app.use("/api/roles", roleRoutes); // Add this line
app.use("/api/permissions", permissionRoutes); // Add this line
app.use("/api/sectors", sectorRoutes);
app.use("/api/subsectors", subsectorRoutes); // Add this line
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user-preferences", userPreferencesRoutes);
app.use("/api/user-ticket-preferences", userTicketPreferencesRoutes);
app.use("/api/deal-type-preferences", dealTypePreferencesRoutes);
app.use("/api/primary-location-preferences", primaryLocationPreferencesRoutes);
app.use("/api/document-share", documentShareRoutes);
app.use("/api/continents", continentRoutes);
app.use("/api/deal-continents", dealContinentRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/deal-regions", dealRegionRoutes);
app.use("/api/subfolders", subfolderRoutes);
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/pipeline-stages", pipelineStageRoutes);
app.use("/api/stage-cards", stageCardRoutes);
app.use("/api/subfolder-access-invites", subfolderAccessInviteRoutes);
app.use("/api/social-media-accounts", socialMediaAccountRoutes);
app.use("/api/investor-milestones", investorMilestoneRoutes);
app.use("/api/investor-milestone-statuses", investorMilestoneStatusRoutes);
app.use("/api/deal-milestones", dealMilestoneRoutes);
app.use("/api/deal-milestone-statuses", dealMilestoneStatusRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/sector-preferences", sectorPreferenceRoutes);
app.use("/api/subsector-preferences", subSectorPreferenceRoutes);
app.use("/api/continent-preferences", continentPreferenceRoutes);
app.use("/api/region-preferences", regionPreferenceRoutes);
app.use("/api/country-preferences", countryPreferenceRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/settings", settingsRoutes);

// Route to run the seeder
app.get("/run-seeder", (req, res) => {
  exec(
    "npx sequelize-cli db:seed:all",
    { env: { ...process.env } },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing seeder: ${error.message}`);
        return res.status(500).send(`Error executing seeder: ${error.message}`);
      }
      if (stderr) {
        console.error(`Seeder stderr: ${stderr}`);
        return res.status(500).send(`Seeder stderr: ${stderr}`);
      }
      console.log(`Seeder stdout: ${stdout}`);
      res.send(`Seeder executed successfully: ${stdout}`);
    }
  );
});

// Route to run the migrations
app.get("/run-migrations", (req, res) => {
  exec(
    "npx sequelize-cli db:migrate",
    { env: { ...process.env } },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing migrations: ${error.message}`);
        return res
          .status(500)
          .send(`Error executing migrations: ${error.message}`);
      }
      if (stderr) {
        console.error(`Migrations stderr: ${stderr}`);
        return res.status(500).send(`Migrations stderr: ${stderr}`);
      }
      console.log(`Migrations stdout: ${stdout}`);
      res.send(`Migrations executed successfully: ${stdout}`);
    }
  );
});

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));

// Schedule task reminders to be sent every day at 8 AM
cron.schedule("0 8 * * *", () => {
  sendTaskReminders();
});

cron.schedule("0 9 * * *", () => {
  sendPredictiveNotifications();
});
