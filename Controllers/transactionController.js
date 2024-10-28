// Controllers/transactionController.js
const db = require("../Models");
const Transaction = db.Transaction;

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ status: "true", transaction });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json({ status: "true", transactions });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ status: "false", message: "Transaction not found." });
    }
    res.status(200).json({ status: "true", transaction });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { transaction_id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ status: "false", message: "Transaction not found." });
    }
    const updatedTransaction = await Transaction.findByPk(req.params.id);
    res.status(200).json({ status: "true", transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { transaction_id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ status: "false", message: "Transaction not found." });
    }
    res.status(200).json({ status: "true", message: "Transaction deleted successfully." });
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