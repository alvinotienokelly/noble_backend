// Models/countryModel.js
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    "country",
    {
      country_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
      },
      continent_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "continents", // Name of the table in the database
          key: "continent_id", // Primary key in the Continent model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      region_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "regions", // Name of the table in the database
          key: "region_id", // Primary key in the Region model
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    { timestamps: true }
  );

  return Country;
};
