// Routes/transactionRoutes.js
const express = require("express");
const transactionController = require("../Controllers/transactionController");
const { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } = transactionController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getAllTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.put("/:id", authMiddleware, checkAdmin, updateTransaction);
router.delete("/:id", authMiddleware, checkAdmin, deleteTransaction);

module.exports = router;