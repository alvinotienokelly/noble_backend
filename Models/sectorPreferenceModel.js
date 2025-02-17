// Models/sectorPreferenceModel.js
module.exports = (sequelize, DataTypes) => {
  const SectorPreference = sequelize.define(
    "sector_preference",
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

  return SectorPreference;
};