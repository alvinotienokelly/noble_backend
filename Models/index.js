//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/noblestride",
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
db.deal_access_invite = require("./dealAccessInviteModel")(sequelize, DataTypes);
db.signature_record = require("./signatureRecordModel")(sequelize, DataTypes);

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
db.tasks.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal", onDelete: "CASCADE" });

// Define notification associations
db.users.hasMany(db.notifications, {
  foreignKey: "user_id",
  as: "notifications",
});
db.notifications.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Define milestone associations
db.deals.hasMany(db.milestones, { foreignKey: "deal_id", as: "milestones", onDelete: "CASCADE" });
db.milestones.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

// Define deal access invite associations

db.users.hasMany(db.deal_access_invite, { foreignKey: "investor_id", as: "dealAccessInvites" });
db.deals.hasMany(db.deal_access_invite, { foreignKey: "deal_id", as: "dealAccessInvites", onDelete: "CASCADE" });
db.deal_access_invite.belongsTo(db.users, { foreignKey: "investor_id", as: "investor" });
db.deal_access_invite.belongsTo(db.deals, {gnKey: "deal_id", as: "deal" });

// Define signature record associations
db.documents.hasMany(db.signature_record, { foreignKey: "document_id", as: "signatureRecords", onDelete: "CASCADE" });
db.deals.hasMany(db.signature_record, { foreignKey: "deal_id", as: "signatureRecords", onDelete: "CASCADE" });
db.users.hasMany(db.signature_record, { foreignKey: "user_id", as: "signatureRecords" });
db.signature_record.belongsTo(db.documents, { foreignKey: "document_id", as: "document" });
db.signature_record.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });
db.signature_record.belongsTo(db.users, { foreignKey: "user_id", as: "user" });


//exporting the module
module.exports = db;
