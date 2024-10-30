// Middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ status: "false", message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ status: "false", message: "Invalid token." });
  }
};

module.exports = authMiddleware;