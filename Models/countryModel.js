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
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: true }
  );

  return Country;
};