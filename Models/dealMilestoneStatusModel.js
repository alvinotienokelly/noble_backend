// Models/dealMilestoneStatusModel.js
module.exports = (sequelize, DataTypes) => {
  const DealMilestoneStatus = sequelize.define(
    "deal_milestone_status",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deal_milestone_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deal_milestones",
          key: "milestone_id",
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

  return DealMilestoneStatus;
};