// Models/invoiceModel.js
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      invoice_id: {
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
      milestone_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "milestones",
          key: "milestone_id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Paid"],
        defaultValue: "Pending",
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Invoice;
};
