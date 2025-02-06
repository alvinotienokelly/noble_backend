// Models/investorMilestoneModel.js
module.exports = (sequelize, DataTypes) => {
  const InvestorMilestone = sequelize.define(
    "investor_milestone",
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

  return InvestorMilestone;
};