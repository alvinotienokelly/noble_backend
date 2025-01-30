// Controllers/auditLogService.js
const db = require("../Models");
const AuditLog = db.AuditLog;

/**
 * Create a new audit log entry
 * @param {Object} params - The parameters for the audit log entry
 * @param {string} params.userId - The ID of the user performing the action
 * @param {string} params.action - The action being performed
 * @param {string} params.details - Additional details about the action
 * @param {string} params.entity - The entity being affected by the action
 * @param {string} params.entityId - The ID of the entity being affected
 */
const createAuditLog = async ({
  userId,
  action,
  details,
  entity,
  entityId,
  ip_address,
}) => {
  try {
    const auditLog = await AuditLog.create({
      user_id: userId,
      action,
      details,
      // entity,
      // entity_id: entityId,
      ip_address: ip_address,
    });
    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    throw new Error("Failed to create audit log");
  }
};

module.exports = {
  createAuditLog,
};
