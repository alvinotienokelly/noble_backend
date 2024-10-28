//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
  "postgres://postgres:@@7389@localhost:5432/noblestride",
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

// Define associations
db.users.hasMany(db.deals, { foreignKey: "created_by", as: "createdDeals" });
db.users.hasMany(db.deals, { foreignKey: "target_company_id", as: "targetCompanyDeals"  });
db.deals.belongsTo(db.users, { foreignKey: "created_by" , as: "createdBy" });
db.deals.belongsTo(db.users, { foreignKey: "target_company_id", as: "targetCompany" });

db.users.hasMany(db.documents, { foreignKey: "uploaded_by", as: "uploadedDocuments" });
db.documents.belongsTo(db.users, { foreignKey: "uploaded_by", as: "uploader" });

db.deals.hasMany(db.documents, { foreignKey: "deal_id", as: "dealDocuments" });
db.documents.belongsTo(db.deals, { foreignKey: "deal_id", as: "deal" });


// Define relationships
db.deals.hasMany(db.Transaction, { foreignKey: 'deal_id' });
db.Transaction.belongsTo(db.deals, { foreignKey: 'deal_id' });

db.users.hasMany(db.Transaction, { foreignKey: 'user_id' });
db.Transaction.belongsTo(db.users, { foreignKey: 'user_id' });


//exporting the module
module.exports = db;
