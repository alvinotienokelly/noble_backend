// Models/regionPreferenceModel.js
module.exports = (sequelize, DataTypes) => {
  const CountryPreference = sequelize.define(
    "country_preference",
    {
      preference_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
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

  return CountryPreference;
};
