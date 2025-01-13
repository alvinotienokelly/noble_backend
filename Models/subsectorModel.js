// Models/subsectorModel.js
module.exports = (sequelize, DataTypes) => {
  const Subsector = sequelize.define(
    "subsector",
    {
      subsector_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

  return Subsector;
};