const AuditLog = require("../models/AuditLog");

const createAuditLog = async (user, action, resource, resourceId, details) => {
  try {
    await AuditLog.create({
      user,
      action,
      resource,
      resourceId,
      details,
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

module.exports = createAuditLog;
