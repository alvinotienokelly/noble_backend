// Controllers/transactionController.js
const db = require("../Models");
const Transaction = db.Transaction;
const Deal = db.deals;

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { deal_id, amount, transaction_type, payment_method } = req.body;
    const user_id = req.user.id; // Assuming the user ID is available in req.user

    const deal = await Deal.findByPk(deal_id);
    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    } else {
      const transaction = await Transaction.create({
        deal_id,
        user_id,
        amount,
        transaction_type,
        payment_method,
      });
      res.status(200).json({
        status: true,
        message: "Transaction created successfully.",
        transaction,
      });
    }
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    const totalAmount = await Transaction.sum("amount");

    const amountsByStatus = await Transaction.findAll({
      attributes: [
        "status",
        [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "totalAmount"],
      ],
      group: ["status"],
    });

    const amounts = {
      Completed: 0,
      Pending: 0,
      Failed: 0,
    };

    amountsByStatus.forEach((item) => {
      amounts[item.status] = parseFloat(item.dataValues.totalAmount);
    });

    res.status(200).json({
      status: true,
      totalAmount: totalAmount,
      completedAmount: amounts.Completed,
      pendingAmount: amounts.Pending,
      failedAmount: amounts.Failed,
      transactions,
    });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);


    if (!transaction) {
      return res
        .status(404)
        .json({ status: false, message: "Transaction not found." });
    }
    res.status(200).json({ status: true, transaction });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { transaction_id: req.params.id },
    });
    if (!updated) {
      return res
        .status(200)
        .json({ status: false, message: "Transaction not found." });
    }
    const updatedTransaction = await Transaction.findByPk(req.params.id);
    res.status(200).json({ status: true, transaction: updatedTransaction });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { transaction_id: req.params.id },
    });
    if (!deleted) {
      return res
        .status(200)
        .json({ status: false, message: "Transaction not found." });
    }
    res
      .status(200)
      .json({ status: true, message: "Transaction deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
