// Models/primaryLocationPreferencesModel.js
module.exports = (sequelize, DataTypes) => {
  const PrimaryLocationPreferences = sequelize.define(
    "primary_location_preferences",
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
      continent: {
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
      country_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "countries",
          key: "country_id",
        },
      },
      region: {
        type: DataTypes.ENUM,
        values: [
          // Africa
          "Northern Africa",
          "Sub-Saharan Africa",
          "Western Africa",
          "Eastern Africa",
          "Central Africa",
          "Southern Africa",
          // Asia
          "East Asia",
          "Southeast Asia",
          "South Asia",
          "Central Asia",
          "Western Asia (Middle East)",
          // Europe
          "Northern Europe",
          "Southern Europe",
          "Eastern Europe",
          "Western Europe",
          // The Americas
          "North America",
          "Central America",
          "Caribbean",
          "South America",
          // Oceania
          "Australasia",
          "Melanesia",
          "Micronesia",
          "Polynesia",
          // Antarctica
          "Antarctica",
        ],
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  PrimaryLocationPreferences.associate = (models) => {
    PrimaryLocationPreferences.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
    PrimaryLocationPreferences.belongsTo(models.countries, {
      foreignKey: "country_id",
      as: "country",
    });
  };

  return PrimaryLocationPreferences;
};
