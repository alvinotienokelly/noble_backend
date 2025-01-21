// Models/milestoneModel.js
module.exports = (sequelize, DataTypes) => {
  const Milestone = sequelize.define(
    "milestone",
    {
      milestone_id: {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Completed"],
        defaultValue: "Pending",
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      commission_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      invoice_generated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deal_stage_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "deal_stages",
          key: "stage_id",
        },
      },
    },
    { timestamps: true }
  );

  return Milestone;
};
