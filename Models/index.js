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

// Define associations
db.users.hasMany(db.deals, { foreignKey: "created_by", as: "createdDeals" });
db.users.hasMany(db.deals, { foreignKey: "target_company_id", as: "targetCompanyDeals"  });
db.deals.belongsTo(db.users, { foreignKey: "created_by" , as: "createdBy" });
db.deals.belongsTo(db.users, { foreignKey: "target_company_id", as: "targetCompany" });

//exporting the module
module.exports = db;
