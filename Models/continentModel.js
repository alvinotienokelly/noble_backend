// Models/continentModel.js
module.exports = (sequelize, DataTypes) => {
  const Continent = sequelize.define(
    "continent",
    {
      continent_id: {
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

  return Continent;
};