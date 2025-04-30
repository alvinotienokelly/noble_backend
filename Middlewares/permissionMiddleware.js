const db = require("../Models");
const RolePermission = db.role_permissions;
const Permission = db.permissions;

const checkPermissions = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // Assuming `req.user` contains the authenticated user's details

      // Fetch the user's role by their ID
      const userRecord = await db.users.findOne({
        where: { id: userId },
        attributes: ["role_id"], // Assuming the user's role ID is stored in the `role_id` field
      });

      if (!userRecord) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }

      const userRole = userRecord.role_id;

      // Fetch all permissions by the provided names
      const permissions = await Permission.findAll({
        where: { name: permissionNames },
        attributes: ["permission_id", "name"],
      });

      if (!permissions.length) {
        return res.status(403).json({
          status: false,
          message: "None of the specified permissions were found.",
        });
      }

      // Check if the user's role has at least one of the required permissions
      const permissionIds = permissions.map((permission) => permission.permission_id);
      const rolePermissions = await RolePermission.findAll({
        where: {
          role_id: userRole,
          permission_id: permissionIds,
        },
      });

      if (!rolePermissions.length) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You do not have any of the required permissions.",
        });
      }

      next(); // User has at least one of the required permissions, proceed to the next middleware or controller
    } catch (error) {
      console.error("Error checking permissions:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkPermissions;