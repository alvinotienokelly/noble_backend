// Models/regionModel.js
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    "region",
    {
      region_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

  return Region;
};
