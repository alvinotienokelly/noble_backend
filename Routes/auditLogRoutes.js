// Routes/auditLogRoutes.js
const express = require("express");
const auditLogController = require("../Controllers/auditLogController");
const { createAuditLog, getAllAuditLogs, getAuditLogById } = auditLogController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAuditLog);
router.get(
  "/",
  authMiddleware,
  checkPermissions(["VIEW_ALL_AUDIT_LOGS"]),

  getAllAuditLogs
);
router.get(
  "/:id",
  authMiddleware,
  checkPermissions(["VIEW_AUDIT_LOG_BY_ID"]),

  getAuditLogById
);

module.exports = router;
