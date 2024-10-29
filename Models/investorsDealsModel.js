// Models/investorsDealsModel.js
module.exports = (sequelize, DataTypes) => {
  const InvestorsDeals = sequelize.define(
    "investors_deals",
    {
      investor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals", // name of the target table
          key: "deal_id", // key in the target table
        },
      },
      investment_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "investors_deals",
    }
  );

  return InvestorsDeals;
};