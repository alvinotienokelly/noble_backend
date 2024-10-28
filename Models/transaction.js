// Models/transaction.js
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      transaction_id: {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM,
        values: ["Credit Card", "Bank Transfer", "Mobile Money"],
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.ENUM,
        values: ["Commission", "Milestone Payment", "Subscription Fee"],
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Completed", "Failed"],
        allowNull: false,
      },
      transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: "transactions",
    }
  );

  return Transaction;
};
