// Routes/auditLogRoutes.js
const express = require("express");
const auditLogController = require("../Controllers/auditLogController");
const { createAuditLog, getAllAuditLogs, getAuditLogById } = auditLogController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, createAuditLog);
router.get("/", authMiddleware, getAllAuditLogs);
router.get("/:id", authMiddleware, getAuditLogById);

module.exports = router;