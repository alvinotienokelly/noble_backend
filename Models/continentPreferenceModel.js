// Models/continentPreferenceModel.js
module.exports = (sequelize, DataTypes) => {
  const ContinentPreference = sequelize.define(
    "continent_preference",
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

  return ContinentPreference;
};
