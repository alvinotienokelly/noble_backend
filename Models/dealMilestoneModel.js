// Models/dealMilestoneModel.js
module.exports = (sequelize, DataTypes) => {
  const DealMilestone = sequelize.define(
    "deal_milestone",
    {
      milestone_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return DealMilestone;
};
