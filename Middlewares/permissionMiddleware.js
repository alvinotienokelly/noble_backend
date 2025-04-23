const db = require("../Models");
const RolePermission = db.role_permissions;
const Permission = db.permissions;

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const user = req.user.id; // Assuming `req.user` contains the authenticated user's details


      // Fetch the user's role by their ID
      const userRecord = await db.users.findOne({
        where: { id: user },
        attributes: ['role_id'], // Assuming the user's role ID is stored in the `role_id` field
      });

      if (!userRecord) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }

      const userRole = userRecord.role_id;
      // Fetch the permission by name
      const permission = await Permission.findOne({
        where: { name: permissionName },
      });
      if (!permission) {
        return res.status(403).json({
          status: false,
          message: "Permission not found.",
        });
      }

      console.log("Permission ID:", permission.permission_id);
      console.log("Role ID:", req.user);
      // Check if the user's role has the required permission
      const rolePermission = await RolePermission.findOne({
        where: {
          role_id: userRole,
          permission_id: permission.permission_id,
        },
      });

      if (!rolePermission) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You do not have the required permission.",
        });
      }

      next(); // User has the required permission, proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkPermission;
