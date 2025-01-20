// Models/dealContinentModel.js
module.exports = (sequelize, DataTypes) => {
  const DealContinent = sequelize.define(
    "deal_continent",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals",
          key: "deal_id",
        },
      },
      continent_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "continents",
          key: "continent_id",
        },
      },
    },
    { timestamps: true }
  );

  return DealContinent;
};