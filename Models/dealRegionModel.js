// Models/dealRegionModel.js
module.exports = (sequelize, DataTypes) => {
  const DealRegion = sequelize.define(
    "deal_region",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals",
          key: "deal_id",
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

  return DealRegion;
};