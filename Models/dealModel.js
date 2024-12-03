// dealModel.js
module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define(
    "deal",
    {
      deal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deal_lead: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sector: {
        type: DataTypes.ENUM,
        values: [
          "Tech",
          "Finance",
          "Healthcare",
          "Energy",
          "Consumer Goods",
          "Industrial",
          "Real Estate",
          "Telecommunications",
          "Utilities",
          "Materials",
        ],
        allowNull: false,
      },
      region: {
        type: DataTypes.ENUM,
        values: [
          "North America",
          "Africa",
          "Europe",
          "Asia",
          "South America",
          "Australia",
          "Antarctica",
        ],
        allowNull: false,
      },
      deal_stage: {
        type: DataTypes.ENUM,
        values: ["Due Diligence", "Term Sheet", "Closed"],
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Active", "Pending", "Inactive"],
        allowNull: false,
        defaultValue: "Active",
      },
      ticket_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deal_size: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      target_company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      key_investors: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      visibility: {
        type: DataTypes.ENUM,
        values: ["Public", "Private"],
        defaultValue: "Public",
      },
      deal_type: {
        type: DataTypes.ENUM,
        values: ["Equity", "Debt", "Equity and Debt"],
        allowNull: true,
      },
      maximum_selling_stake: {
        type: DataTypes.ENUM,
        values: ["Minority", "Majority"],
        allowNull: true,
      },
      teaser: {
        type: DataTypes.ENUM,
        values: ["Yes", "No"],
        allowNull: false,
        defaultValue: "Yes",
      },
      model: {
        type: DataTypes.ENUM,
        values: ["Yes", "No"],
        allowNull: true,
        defaultValue: "No",
      },
    },
    {
      timestamps: true,
    }
  );

  return Deal;
};
