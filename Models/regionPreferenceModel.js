// Models/regionPreferenceModel.js
module.exports = (sequelize, DataTypes) => {
  const RegionPreference = sequelize.define(
    "region_preference",
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
      region_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "regions",
          key: "region_id",
        },
      },
    },
    { timestamps: true }
  );

  return RegionPreference;
};
