// Models/subSectorPreferenceModel.js
module.exports = (sequelize, DataTypes) => {
  const SubSectorPreference = sequelize.define(
    "sub_sector_preference",
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
      sub_sector_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subsectors",
          key: "subsector_id",
        },
      },
    },
    { timestamps: true }
  );

  return SubSectorPreference;
};
