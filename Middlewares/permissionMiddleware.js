// Middlewares/permissionMiddleware.js
const db = require("../Models");
const RolePermission = db.role_permissions;
const Permission = db.permissions;

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role_id;

      const permission = await Permission.findOne({ where: { name: permissionName } });
      if (!permission) {
        return res.status(403).json({ status: false, message: "Permission not found." });
      }

      const rolePermission = await RolePermission.findOne({
        where: {
          role_id: userRole,
          permission_id: permission.permission_id,
        },
      });

      if (!rolePermission) {
        return res.status(403).json({ status: false, message: "Access denied. You do not have the required permission." });
      }

      next();
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkPermission;