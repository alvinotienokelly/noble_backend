// Models/sectorModel.js
module.exports = (sequelize, DataTypes) => {
  const Sector = sequelize.define(
    "sector",
    {
      sector_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: true }
  );

  return Sector;
};