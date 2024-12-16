// Models/investorDealStagesModel.js
module.exports = (sequelize, DataTypes) => {
  const InvestorDealStages = sequelize.define(
    "investor_deal_stages",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      investor_id: {
        type: DataTypes.INTEGER,
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
      stage_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deal_stages", // name of the target table
          key: "stage_id", // key in the target table
        },
      },
    },
    {
      timestamps: true,
      tableName: "investor_deal_stages",
    }
  );

  return InvestorDealStages;
};
