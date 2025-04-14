const db = require("../Models");
const User = db.users;
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
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    // Fetch audit logs with pagination
    const { count: totalAuditLogs, rows: auditLogs } =
      await AuditLog.findAndCountAll({
        include: [{ model: User, as: "user" }],
        offset,
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]], // Order by most recent logs
      });

    const totalPages = Math.ceil(totalAuditLogs / limit);

    res.status(200).json({
      status: "true",
      totalAuditLogs,
      totalPages,
      currentPage: parseInt(page),
      auditLogs,
    });
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
