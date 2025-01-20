// Models/dealCountryModel.js
module.exports = (sequelize, DataTypes) => {
  const DealCountry = sequelize.define(
    "deal_country",
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
      country_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "countries",
          key: "country_id",
        },
      },
    },
    { timestamps: true }
  );

  return DealCountry;
};