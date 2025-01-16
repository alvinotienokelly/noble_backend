// Models/userPreferencesModel.js
module.exports = (sequelize, DataTypes) => {
  const UserPreferences = sequelize.define(
    "user_preferences",
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
      sector_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "sectors",
          key: "sector_id",
        },
      },
    },
    { timestamps: true }
  );

  UserPreferences.associate = (models) => {
    UserPreferences.belongsTo(models.users, { foreignKey: "user_id", as: "user" });
    UserPreferences.belongsTo(models.sectors, { foreignKey: "sector_id", as: "sector" });
  };

  return UserPreferences;
};