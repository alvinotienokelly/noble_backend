// Routes/commissionRoutes.js
const express = require("express");
const commissionController = require("../Controllers/commissionController");
const { updateMilestoneStatus, getInvoicesByDealId } = commissionController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.put("/milestone/:id/status", authMiddleware, updateMilestoneStatus);
router.get("/deal/:dealId/invoices", authMiddleware, getInvoicesByDealId);

module.exports = router;