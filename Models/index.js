/**
 * @fileoverview This module sets up the Sequelize ORM with PostgreSQL and defines the models and their associations for the application.
 *
 * @requires sequelize
 * @requires ./userModel
 * @requires ./dealModel
 * @requires ./documentModel
 * @requires ./transaction
 * @requires ./auditLogModel
 * @requires ./investorsDealsModel
 * @requires ./verificationCodeModel
 * @requires ./dealMeetings
 * @requires ./taskModel
 * @requires ./notificationModel
 * @requires ./milestoneModel
 * @requires ./dealAccessInviteModel
 * @requires ./signatureRecordModel
 * @requires ./invoiceModel
 * @requires ./folderModel
 * @requires ./folderAccessInviteModel
 * @requires ./socialAccountTypeModel
 * @requires ./userReviewModel
 * @requires ./contactPersonModel
 * @requires ./dealStageModel
 * @requires ./investorDealStagesModel
 * @requires ./countryModel
 * @requires ./roleModel
 * @requires ./permissionModel
 * @requires ./rolePermissionModel
 * @requires ./sectorModel
 * @requires ./subsectorModel
 * @requires ./userPreferencesModel
 * @requires ./userTicketPreferencesModel
 * @requires ./dealTypePreferencesModel
 * @requires ./primaryLocationPreferencesModel
 * @requires ./documentShareModel
 *
 * @description This module initializes the Sequelize instance with PostgreSQL and sets up the database connection. It imports all the models and defines their associations, including one-to-many, many-to-many, and belongs-to relationships. The models include users, deals, documents, transactions, audit logs, investors deals, verification codes, deal meetings, tasks, notifications, milestones, deal access invites, signature records, invoices, folders, folder access invites, social account types, user reviews, contact persons, deal stages, investor deal stages, countries, roles, permissions, role permissions, sectors, subsectors, user preferences, user ticket preferences, deal type preferences, primary location preferences, and document shares.
 */
//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
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
db.subfolders = require("./subfolderModel")(sequelize, DataTypes);
db.folder_access_invite = require("./folderAccessInviteModel")(
  sequelize,
  DataTypes
);
db.social_account_types = require("./socialAccountTypeModel")(
  sequelize,
  DataTypes
);
db.social_media_accounts = require("./socialMediaAccountModel")(
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
db.user_preferences = require("./userPreferencesModel")(sequelize, DataTypes);
db.user_ticket_preferences = require("./userTicketPreferencesModel")(
  sequelize,
  DataTypes
);
db.deal_type_preferences = require("./dealTypePreferencesModel")(
  sequelize,
  DataTypes
);

db.primary_location_preferences = require("./primaryLocationPreferencesModel")(
  sequelize,
  DataTypes
);

db.document_shares = require("./documentShareModel")(sequelize, DataTypes);
db.continents = require("./continentModel")(sequelize, DataTypes);
db.deal_continents = require("./dealContinentModel")(sequelize, DataTypes);
db.regions = require("./regionModel")(sequelize, DataTypes);
db.deal_regions = require("./dealRegionModel")(sequelize, DataTypes);
db.deal_countries = require("./dealCountryModel")(sequelize, DataTypes);
db.pipelines = require("./pipelineModel")(sequelize, DataTypes); // Add this line
db.pipeline_stages = require("./pipelineStageModel")(sequelize, DataTypes); // Add this line
db.stage_cards = require("./stageCardModel")(sequelize, DataTypes); // Add this line
db.subfolder_access_invite = require("./subfolderAccessInviteModel")(
  sequelize,
  DataTypes
); // Add this line
db.investor_milestones = require("./investorMilestoneModel")(
  sequelize,
  DataTypes
);
db.investor_milestone_statuses = require("./investorMilestoneStatusModel")(
  sequelize,
  DataTypes
);
db.deal_milestones = require("./dealMilestoneModel")(sequelize, DataTypes);
db.deal_milestone_statuses = require("./dealMilestoneStatusModel")(
  sequelize,
  DataTypes
);
db.sector_preferences = require("./sectorPreferenceModel")(
  sequelize,
  DataTypes
);
db.document_types = require("./documentTypeModel")(sequelize, DataTypes);
db.sub_sector_preferences = require("./subSectorPreferenceModel")(
  sequelize,
  DataTypes
);
db.continent_preferences = require("./continentPreferenceModel")(
  sequelize,
  DataTypes
);
db.region_preferences = require("./regionPreferenceModel")(
  sequelize,
  DataTypes
);
db.country_preferences = require("./CountryPreferenceModel")(
  sequelize,
  DataTypes
);
db.deal_leads = require("./dealLeadModel")(sequelize, DataTypes);
db.settings = require("./settingsModel")(sequelize, DataTypes);

// Define associations
db.users.hasMany(db.deal_leads, {
  foreignKey: "user_id",
  as: "dealLeads",
});

db.deals.hasMany(db.deal_leads, {
  foreignKey: "deal_id",
  as: "dealLeads",
});

db.deal_leads.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.deal_leads.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
});

db.country_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.users.hasMany(db.country_preferences, {
  foreignKey: "user_id",
  as: "countryPreferences",
});

db.country.hasMany(db.country_preferences, {
  foreignKey: "country_id",
  as: "countryPreferences",
});
db.country_preferences.belongsTo(db.country, {
  foreignKey: "country_id",
  as: "country",
});

// Define associations
db.users.hasMany(db.region_preferences, {
  foreignKey: "user_id",
  as: "regionPreferences",
});
db.region_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.regions.hasMany(db.region_preferences, {
  foreignKey: "region_id",
  as: "regionPreferences",
});
db.region_preferences.belongsTo(db.regions, {
  foreignKey: "region_id",
  as: "region",
});
// Define associations
db.users.hasMany(db.continent_preferences, {
  foreignKey: "user_id",
  as: "continentPreferences",
});
db.continent_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.continents.hasMany(db.continent_preferences, {
  foreignKey: "continent_id",
  as: "continentPreferences",
});
db.continent_preferences.belongsTo(db.continents, {
  foreignKey: "continent_id",
  as: "continent",
});
// Define associations
db.users.hasMany(db.sub_sector_preferences, {
  foreignKey: "user_id",
  as: "subSectorPreferences",
});
db.sub_sector_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.subsectors.hasMany(db.sub_sector_preferences, {
  foreignKey: "sub_sector_id",
  as: "subSectorPreferences",
});
db.sub_sector_preferences.belongsTo(db.subsectors, {
  foreignKey: "sub_sector_id",
  as: "subSector",
});

// Define associations
db.documents.belongsTo(db.document_types, {
  foreignKey: "document_type_id",
  as: "documentType",
});
db.document_types.hasMany(db.documents, {
  foreignKey: "document_type_id",
  as: "documents",
});
db.users.hasMany(db.sector_preferences, {
  foreignKey: "user_id",
  as: "sectorPreferences",
});
db.sector_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.sectors.hasMany(db.sector_preferences, {
  foreignKey: "sector_id",
  as: "sectorPreferences",
});
db.sector_preferences.belongsTo(db.sectors, {
  foreignKey: "sector_id",
  as: "sector",
});
// Define associations deal_milestone_statuses
db.deal_milestones.hasMany(db.deal_milestone_statuses, {
  foreignKey: "deal_milestone_id",
  as: "milestoneStatuses",
});
db.deal_milestone_statuses.belongsTo(db.deal_milestones, {
  foreignKey: "deal_milestone_id",
  as: "milestone",
});

db.deals.hasMany(db.deal_milestone_statuses, {
  foreignKey: "deal_id",
  as: "dealMilestoneStatus",
});
db.deal_milestone_statuses.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
});

// Define investor_milestones associations
db.investor_milestones.hasMany(db.investor_milestone_statuses, {
  foreignKey: "investor_milestone_id",
  as: "milestoneStatuses",
});
db.investor_milestone_statuses.belongsTo(db.investor_milestones, {
  foreignKey: "investor_milestone_id",
  as: "milestone",
});

db.users.hasMany(db.investor_milestone_statuses, {
  foreignKey: "user_id",
  as: "userMilestoneStatuses",
});
db.investor_milestone_statuses.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.deals.hasMany(db.investor_milestone_statuses, {
  foreignKey: "deal_id",
  as: "dealMilestoneStatuses",
});
db.investor_milestone_statuses.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
});

// Define social_media_account associations
db.users.hasMany(db.social_media_accounts, {
  foreignKey: "user_id",
  as: "socialMediaAccounts",
});
db.social_media_accounts.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.social_account_types.hasMany(db.social_media_accounts, {
  foreignKey: "social_account_type_id",
  as: "socialMediaAccounts",
});
db.social_media_accounts.belongsTo(db.social_account_types, {
  foreignKey: "social_account_type_id",
  as: "socialAccountType",
});

// Define subfolders invite associations
db.subfolders.hasMany(db.subfolder_access_invite, {
  foreignKey: "subfolder_id",
  as: "accessInvites",
});
db.subfolder_access_invite.belongsTo(db.subfolders, {
  foreignKey: "subfolder_id",
  as: "subfolder",
});

// Define pipelines associations
db.pipelines.hasMany(db.pipeline_stages, {
  foreignKey: "pipeline_id",
  as: "stages",
});
db.pipeline_stages.belongsTo(db.pipelines, {
  foreignKey: "pipeline_id",
  as: "pipeline",
});

db.pipeline_stages.hasMany(db.stage_cards, {
  foreignKey: "pipeline_stage_id",
  as: "cards",
});
db.stage_cards.belongsTo(db.pipeline_stages, {
  foreignKey: "pipeline_stage_id",
  as: "pipelineStage",
});
db.stage_cards.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
db.users.hasMany(db.stage_cards, { foreignKey: "user_id", as: "stageCards" });

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
db.tasks.belongsTo(db.deal_stages, {
  foreignKey: "deal_stage_id",
  as: "dealStage",
});
db.deal_stages.hasMany(db.tasks, {
  foreignKey: "deal_stage_id",
  as: "tasks",
});
db.deals.belongsTo(db.deal_stages, {
  foreignKey: "deal_stage_id",
  as: "dealStage",
});
db.deal_stages.hasMany(db.deals, {
  foreignKey: "deal_stage_id",
  as: "deals",
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
db.milestones.belongsTo(db.deal_stages, {
  foreignKey: "deal_stage_id",
  as: "dealStage",
});

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
db.deal_access_invite.belongsTo(db.deals, {
  foreignKey: "deal_id",
  as: "deal",
});

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
db.deal_stages.hasMany(db.milestones, {
  foreignKey: "deal_stage_id",
  as: "milestones",
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

db.permissions.hasMany(db.role_permissions, {
  foreignKey: "permission_id",
  as: "rolePermissions",
});

// Define role permission associations
// db.roles.belongsToMany(db.permissions, {
//   through: db.role_permissions,
//   foreignKey: "role_id",
//   as: "permissions",
// });
// db.permissions.belongsToMany(db.roles, {
//   through: db.role_permissions,
//   foreignKey: "permission_id",
//   as: "roles",
// });

// Define associations
db.role_permissions.belongsTo(db.permissions, {
  foreignKey: "permission_id",
  as: "permission",
});
db.role_permissions.belongsTo(db.roles, {
  foreignKey: "role_id",
  as: "role",
});

db.roles.hasMany(db.role_permissions, {
  foreignKey: "role_id",
  as: "permissions",
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

// Define user preferences associations
db.users.hasMany(db.user_preferences, {
  foreignKey: "user_id",
  as: "userPreferences",
});
db.user_preferences.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
db.user_preferences.belongsTo(db.sectors, {
  foreignKey: "sector_id",
  as: "sector",
});

// Define ticket preference associations
db.users.hasOne(db.user_ticket_preferences, {
  foreignKey: "user_id",
  as: "ticketPreferences",
});
db.user_ticket_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

// Define deal type preference associations
db.users.hasMany(db.deal_type_preferences, {
  foreignKey: "user_id",
  as: "dealTypePreferences",
});
db.deal_type_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

// Define primary location preference associations
db.users.hasMany(db.primary_location_preferences, {
  foreignKey: "user_id",
  as: "primaryLocationPreferences",
});
db.country.hasMany(db.primary_location_preferences, {
  foreignKey: "country_id",
  as: "primaryCountryPreferences",
});
db.primary_location_preferences.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.primary_location_preferences.belongsTo(db.country, {
  foreignKey: "country_id",
  as: "country",
});

// Define document share associations
db.documents.hasMany(db.document_shares, {
  foreignKey: "document_id",
  as: "documentShares",
  onDelete: "CASCADE",
});
db.document_shares.belongsTo(db.documents, {
  foreignKey: "document_id",
  as: "document",
});
db.users.hasMany(db.document_shares, {
  foreignKey: "shared_by",
  as: "sharedDocuments",
});
db.document_shares.belongsTo(db.users, {
  foreignKey: "shared_by",
  as: "sharer",
});

// Define many-to-many relationships
db.deals.belongsToMany(db.continents, {
  through: db.deal_continents,
  foreignKey: "deal_id",
  as: "continents",
});
db.continents.belongsToMany(db.deals, {
  through: db.deal_continents,
  foreignKey: "continent_id",
  as: "deals",
});

// Define region associations
db.continents.hasMany(db.regions, {
  foreignKey: "continent_id",
  as: "regions",
});
db.regions.belongsTo(db.continents, {
  foreignKey: "continent_id",
  as: "continent",
});

// Define deal region associations
db.deals.belongsToMany(db.regions, {
  through: db.deal_regions,
  foreignKey: "deal_id",
  as: "regions",
});
db.regions.belongsToMany(db.deals, {
  through: db.deal_regions,
  foreignKey: "region_id",
  as: "deals",
});

// Define deal country associations
db.deals.belongsToMany(db.country, {
  through: db.deal_countries,
  foreignKey: "deal_id",
  as: "countries",
});
db.country.belongsToMany(db.deals, {
  through: db.deal_countries,
  foreignKey: "country_id",
  as: "deals",
});

db.country.belongsTo(db.continents, {
  foreignKey: "continent_id",
  as: "continent",
});
db.continents.hasMany(db.country, {
  foreignKey: "continent_id",
  as: "countries",
});

db.country.belongsTo(db.regions, {
  foreignKey: "region_id",
  as: "region",
});
db.regions.hasMany(db.country, {
  foreignKey: "region_id",
  as: "countries",
});

// Define country associations
db.country.hasMany(db.deal_countries, {
  foreignKey: "country_id",
  as: "dealCountries",
});
db.deal_countries.belongsTo(db.country, {
  foreignKey: "country_id",
  as: "country",
});
db.deals.hasMany(db.deal_countries, {
  foreignKey: "deal_id",
  as: "dealCountries",
});
db.deal_countries.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

// Define region associations
db.regions.hasMany(db.deal_regions, {
  foreignKey: "region_id",
  as: "dealRegions",
});
db.deal_regions.belongsTo(db.regions, {
  foreignKey: "region_id",
  as: "region",
});
db.deals.hasMany(db.deal_regions, { foreignKey: "deal_id", as: "dealRegions" });
db.deal_regions.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

// Define continent associations
db.continents.hasMany(db.deal_continents, {
  foreignKey: "continent_id",
  as: "dealContinents",
});
db.deal_continents.belongsTo(db.continents, {
  foreignKey: "continent_id",
  as: "continent",
});
db.deals.hasMany(db.deal_continents, {
  foreignKey: "deal_id",
  as: "dealContinents",
});
db.deal_continents.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });

// Define subfolder associations
db.folders.hasMany(db.subfolders, {
  foreignKey: "parent_folder_id",
  as: "subfolders",
});
db.subfolders.belongsTo(db.folders, {
  foreignKey: "parent_folder_id",
  as: "parentFolder",
});

db.subfolders.belongsTo(db.users, {
  foreignKey: "created_by",
  as: "creator",
});

db.subfolders.belongsTo(db.users, {
  foreignKey: "created_for",
  as: "createdFor",
});

db.users.hasMany(db.subfolders, {
  foreignKey: "created_by",
  as: "createdSubfolders",
});

db.users.hasMany(db.subfolders, {
  foreignKey: "created_for",
  as: "createdForSubfolders",
});

db.subfolders.hasMany(db.documents, {
  foreignKey: "subfolder_id",
  as: "subfolderDocuments",
});

db.documents.belongsTo(db.subfolders, {
  foreignKey: "subfolder_id",
  as: "subfolder",
});

db.subfolders.belongsTo(db.subfolders, {
  foreignKey: "parent_subfolder_id",
  as: "parentSubfolder",
});
db.subfolders.hasMany(db.subfolders, {
  foreignKey: "parent_subfolder_id",
  as: "childSubfolders",
});

//exporting the module
module.exports = db;
