//importing modules
const express = require("express");
const userController = require("../Controllers/userController");
const {
  signup,
  login,
  verifyCode,
  logout,
  forgotPassword,
  resetPassword,
  getUsersByType,
  bulkUploadUsers,
  getUserById,
  getProfile,
} = userController;
const userAuth = require("../Middlewares/userAuth");
const authMiddleware = require("../Middlewares/authMiddleware");
const db = require("../Models");

const User = db.users;

const router = express.Router();

//signup endpoint
//passing the middleware function to the signup
router.post("/signup", userAuth.saveUser, signup);

//login route
router.post("/login", login);

//get users by type route
router.get("/users-by-type/:type", authMiddleware, getUsersByType);

//verify code route
router.post("/verify-code", verifyCode);

//logout route
router.post("/logout", authMiddleware, logout);

//forgot password route
router.post("/forgot-password", forgotPassword);

//reset password route
router.post("/reset-password", resetPassword);

//bulk-upload

router.post("/bulk-upload", authMiddleware, bulkUploadUsers);
router.get("/user/:id", authMiddleware, getUserById); // Add this line
router.get("/profile", authMiddleware, getProfile); // Add this line


module.exports = router;
