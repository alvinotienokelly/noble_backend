const db = require("../Models");
const AuditLog = db.AuditLog;

// Create a new audit log entry
const createAuditLog = async (req, res) => {
  try {
    const auditLog = await AuditLog.create(req.body);
    res.status(200).json({ status: "true", auditLog });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Get all audit logs
const getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.findAll();
    res.status(200).json({ status: "true", auditLogs });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

// Get an audit log by ID
const getAuditLogById = async (req, res) => {
  try {
    const auditLog = await AuditLog.findByPk(req.params.id);
    if (!auditLog) {
      return res
        .status(404)
        .json({ status: "false", message: "Audit log not found." });
    }
    res.status(200).json({ status: "true", auditLog });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
};
