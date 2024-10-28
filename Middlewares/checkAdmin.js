// Middlewares/checkAdmin.js
const checkAdmin = (req, res, next) => {
    if (req.user.role === 'Administrator') {
      return res.status(403).json({ status: false, message: "Access denied. Only administrators can perform this action." });
    }
    next();
  };
  
  module.exports = checkAdmin;