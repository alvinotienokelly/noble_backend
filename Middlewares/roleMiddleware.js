const db = require("../Models");
const Role = db.roles;

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role_id; // Assuming `req.user` contains the authenticated user's details

      // Fetch the user's role
      const role = await Role.findByPk(userRole);
      if (!role || role.name !== requiredRole) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You do not have the required role.",
        });
      }

      next(); // User has the required role, proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
};

module.exports = checkRole;