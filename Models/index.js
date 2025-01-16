//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
  "postgresql://noblestride:szcNy266OSYed9vMLf2DGwHsYSiE8qpg@dpg-ctucl01u0jms73f5qtfg-a/noblestride_be28",
  { dialect: "postgres" }
);

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to discover`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.users = require("./userModel")(sequelize, DataTypes);
db.deals = require("./dealModel")(sequelize, DataTypes);
db.documents = require("./documentModel")(sequelize, DataTypes);
db.Transaction = require("./transaction")(sequelize, DataTypes);
db.AuditLog = require("./auditLogModel")(sequelize, DataTypes);
db.investorsDeals = require("./investorsDealsModel")(sequelize, DataTypes);
db.VerificationCode = require("./verificationCodeModel")(sequelize, DataTypes);
db.dealMeetings = require("./dealMeetings")(sequelize, DataTypes);
db.tasks = require("./taskModel")(sequelize, DataTypes);
db.notifications = require("./notificationModel")(sequelize, DataTypes);
db.milestones = require("./milestoneModel")(sequelize, DataTypes);
db.deal_access_invite = require("./dealAccessInviteModel")(
  sequelize,
  DataTypes
);
db.signature_record = require("./signatureRecordModel")(sequelize, DataTypes);
db.invoices = require("./invoiceModel")(sequelize, DataTypes);
db.folders = require("./folderModel")(sequelize, DataTypes);
db.folder_access_invite = require("./folderAccessInviteModel")(
  sequelize,
  DataTypes
);
db.social_account_types = require("./socialAccountTypeModel")(
  sequelize,
  DataTypes
);
db.user_reviews = require("./userReviewModel")(sequelize, DataTypes);
db.contact_persons = require("./contactPersonModel")(sequelize, DataTypes);
db.deal_stages = require("./dealStageModel")(sequelize, DataTypes);
db.investor_deal_stages = require("./investorDealStagesModel")(
  sequelize,
  DataTypes
);
db.country = require("./countryModel")(sequelize, DataTypes);
db.roles = require("./roleModel")(sequelize, DataTypes);
db.permissions = require("./permissionModel")(sequelize, DataTypes);
db.role_permissions = require("./rolePermissionModel")(sequelize, DataTypes);
db.sectors = require("./sectorModel")(sequelize, DataTypes); // Add this line
db.subsectors = require("./subsectorModel")(sequelize, DataTypes); // Add this line

// Define associations
db.users.hasMany(db.deals, { foreignKey: "created_by", as: "createdDeals" });
db.users.hasMany(db.deals, {
  foreignKey: "target_company_id",
  as: "targetCompanyDeals",
});
db.deals.belongsTo(db.users, { foreignKey: "created_by", as: "createdBy" });
db.deals.belongsTo(db.users, {
  foreignKey: "target_company_id",
  as: "targetCompany",
});

db.deals.belongsTo(db.users, {
  foreignKey: "deal_lead",
  as: "dealLead",
});

db.users.hasMany(db.documents, {
  foreignKey: "uploaded_by",
  as: "uploadedDocuments",
});
db.documents.belongsTo(db.users, { foreignKey: "uploaded_by", as: "uploader" });

db.deals.hasMany(db.documents, { foreignKey: "deal_id", as: "dealDocuments" });
db.documents.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

db.deals.hasMany(db.Transaction, { foreignKey: "deal_id" });
db.Transaction.belongsTo(db.deals, { foreignKey: "deal_id" });

db.deals.hasMany(db.dealMeetings, { foreignKey: "deal_id", as: "meetings" });
db.dealMeetings.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

db.users.hasMany(db.Transaction, { foreignKey: "user_id" });
db.Transaction.belongsTo(db.users, { foreignKey: "user_id" });

db.users.hasMany(db.AuditLog, { foreignKey: "user_id" });
db.AuditLog.belongsTo(db.users, { foreignKey: "user_id" });

// Define many-to-many relationships
db.users.belongsToMany(db.deals, {
  through: db.investorsDeals,
  foreignKey: "investor_id",
  as: "investedDeals",
});
db.deals.belongsToMany(db.users, {
  through: db.investorsDeals,
  foreignKey: "deal_id",
  as: "investors",
});

db.users.hasMany(db.VerificationCode, {
  foreignKey: "user_id",
  as: "verificationCodes",
});
db.VerificationCode.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define task associations
db.users.hasMany(db.tasks, { foreignKey: "assigned_to", as: "assignedTasks" });
db.users.hasMany(db.tasks, { foreignKey: "created_by", as: "createdTasks" });
db.tasks.belongsTo(db.users, { foreignKey: "assigned_to", as: "assignee" });
db.tasks.belongsTo(db.users, { foreignKey: "created_by", as: "creator" });
db.tasks.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
  onDelete: "CASCADE",
});

// Define notification associations
db.users.hasMany(db.notifications, {
  foreignKey: "user_id",
  as: "notifications",
});
db.notifications.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define milestone associations
db.deals.hasMany(db.milestones, {
  foreignKey: "deal_id",
  as: "milestones",
  onDelete: "CASCADE",
});
db.milestones.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

// Define deal access invite associations

db.users.hasMany(db.deal_access_invite, {
  foreignKey: "investor_id",
  as: "dealAccessInvites",
});
db.deals.hasMany(db.deal_access_invite, {
  foreignKey: "deal_id",
  as: "dealAccessInvites",
  onDelete: "CASCADE",
});
db.deal_access_invite.belongsTo(db.users, {
  foreignKey: "investor_id",
  as: "investor",
});
db.deal_access_invite.belongsTo(db.deals, { gnKey: "deal_id", as: "deal" });

// Define signature record associations
db.documents.hasMany(db.signature_record, {
  foreignKey: "document_id",
  as: "signatureRecords",
  onDelete: "CASCADE",
});
db.deals.hasMany(db.signature_record, {
  foreignKey: "deal_id",
  as: "signatureRecords",
  onDelete: "CASCADE",
});
db.users.hasMany(db.signature_record, {
  foreignKey: "user_id",
  as: "signatureRecords",
});
db.signature_record.belongsTo(db.documents, {
  foreignKey: "document_id",
  as: "document",
});
db.signature_record.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });
db.signature_record.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

db.deals.hasMany(db.invoices, {
  foreignKey: "deal_id",
  as: "dealInvoices",
  onDelete: "CASCADE",
});
db.milestones.hasMany(db.invoices, {
  foreignKey: "milestone_id",
  as: "milestoneInvoices",
  onDelete: "CASCADE",
});
db.invoices.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });
db.invoices.belongsTo(db.milestones, {
  foreignKey: "milestone_id",
  as: "milestone",
});

// Define associations
db.users.hasMany(db.folders, {
  foreignKey: "created_by",
  as: "createdFolders",
});
db.folders.belongsTo(db.users, { foreignKey: "created_by", as: "creator" });
db.folders.belongsTo(db.users, { foreignKey: "created_for", as: "createdFor" });
db.folders.hasMany(db.folder_access_invite, {
  foreignKey: "folder_id",
  as: "accessInvites",
});

db.folders.hasMany(db.documents, {
  foreignKey: "folder_id",
  as: "folderDocuments",
});
db.documents.belongsTo(db.folders, { foreignKey: "folder_id", as: "folder" });

// Define folder access invite associations
db.folder_access_invite.belongsTo(db.folders, {
  foreignKey: "folder_id",
  as: "folder",
});

// Define user review associations
db.users.hasMany(db.user_reviews, { foreignKey: "user_id", as: "userReviews" });
db.user_reviews.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define contact person associations
db.users.hasMany(db.contact_persons, {
  foreignKey: "user_id",
  as: "contactPersons",
});
db.contact_persons.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define deal stage associations
db.users.hasMany(db.deal_stages, { foreignKey: "user_id", as: "dealStages" });
db.deal_stages.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define investor deal stage associations
db.users.hasMany(db.investor_deal_stages, {
  foreignKey: "investor_id",
  as: "investorDealStages",
});
db.deals.hasMany(db.investor_deal_stages, {
  foreignKey: "deal_id",
  as: "dealInvestorStages",
});
db.deal_stages.hasMany(db.investor_deal_stages, {
  foreignKey: "stage_id",
  as: "stageInvestorStages",
});
db.investor_deal_stages.belongsTo(db.users, {
  foreignKey: "investor_id",
  as: "investor",
});
db.investor_deal_stages.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
});
db.investor_deal_stages.belongsTo(db.deal_stages, {
  foreignKey: "stage_id",
  as: "stage",
});

// Define role associations
db.users.belongsTo(db.roles, { foreignKey: "role_id", as: "userRole" });
db.roles.hasMany(db.users, { foreignKey: "role_id", as: "users" });

// Define role permission associations
db.roles.belongsToMany(db.permissions, {
  through: db.role_permissions,
  foreignKey: "role_id",
  as: "permissions",
});
db.permissions.belongsToMany(db.roles, {
  through: db.role_permissions,
  foreignKey: "permission_id",
  as: "roles",
});

// Define sector associations
db.deals.belongsTo(db.sectors, { foreignKey: "sector_id", as: "dealSector" });
db.sectors.hasMany(db.deals, { foreignKey: "sector_id", as: "deals" });

// Define subsector associations
db.deals.belongsTo(db.subsectors, {
  foreignKey: "subsector_id",
  as: "dealSubsector",
});
db.subsectors.hasMany(db.deals, { foreignKey: "subsector_id", as: "deals" });
db.sectors.hasMany(db.subsectors, {
  foreignKey: "sector_id",
  as: "subsectors",
});
db.subsectors.belongsTo(db.sectors, { foreignKey: "sector_id", as: "sector" });

//exporting the module
module.exports = db;
