// Models/investorMilestoneStatusModel.js
module.exports = (sequelize, DataTypes) => {
  const InvestorMilestoneStatus = sequelize.define(
    "investor_milestone_status",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      investor_milestone_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "investor_milestones",
          key: "milestone_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals",
          key: "deal_id",
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Completed"],
        defaultValue: "Pending",
      },
    },
    { timestamps: true }
  );

  return InvestorMilestoneStatus;
};