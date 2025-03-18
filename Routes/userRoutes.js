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
  getEmployees,
  updateUserStatus, // Add this line
  markUserAsArchived, // Add this line
  markUserAsOpen, // Add this line
  markUserAsOnHold, // Add this line
  updateTotalInvestments, // Add this line
  updateAverageCheckSize, // Add this line
  updateSuccessfulExits, // Add this line
  updatePortfolioIPR, // Add this line
  updateDescription, // Add this line
  updateAddressableMarket,
  updateCurrentMarket,
  updateTam,
  updateSam,
  updateLocation,
  updateYearFounded,
  updateSom,
  updateCac,
  updateEbiTda,
  updateTotalAssets,
  updateGrossMargin,
  updateUserProfile,
  adminUpdateUserProfile,
  uploadProfileImage,
} = userController;
const userAuth = require("../Middlewares/userAuth");
const authMiddleware = require("../Middlewares/authMiddleware");
const db = require("../Models");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const User = db.users;

const router = express.Router();

//signup endpoint
//passing the middleware function to the signup
router.post("/upload-profile-image", authMiddleware, uploadProfileImage);
router.post("/profile", upload.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send("Hello world");
});
router.post("/signup", userAuth.saveUser, signup);
router.put("/profile", authMiddleware, updateUserProfile); // Add this line
router.put("/:id/archive", authMiddleware, markUserAsArchived); // Add this line
router.put("/admin/profile/:id", authMiddleware, adminUpdateUserProfile);
router.put("/:id/open", authMiddleware, markUserAsOpen); // Add this line
router.put("/:id/on-hold", authMiddleware, markUserAsOnHold); // Add this line
router.put("/:id/total-investments", authMiddleware, updateTotalInvestments); // Add this line
router.put("/:id/average-check-size", authMiddleware, updateAverageCheckSize); // Add this line
router.put("/:id/successful-exits", authMiddleware, updateSuccessfulExits); // Add this line
router.put("/:id/portfolio-ipr", authMiddleware, updatePortfolioIPR); // Add this line
router.put("/:id/description", authMiddleware, updateDescription); // Add this line
router.put("/:id/addressable-market", authMiddleware, updateAddressableMarket);
router.put("/:id/current-market", authMiddleware, updateCurrentMarket);
router.put("/:id/tam", authMiddleware, updateTam);
router.put("/:id/sam", authMiddleware, updateSam);
router.put("/:id/location", authMiddleware, updateLocation);
router.put("/:id/year-founded", authMiddleware, updateYearFounded);
router.put("/:id/som", authMiddleware, updateSom);
router.put("/:id/cac", authMiddleware, updateCac);
router.put("/:id/ebitda", authMiddleware, updateEbiTda);
router.put("/:id/total-assets", authMiddleware, updateTotalAssets);
router.put("/:id/gross-margin", authMiddleware, updateGrossMargin);
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
router.put("/:id/status", authMiddleware, updateUserStatus); // Add this line
router.get("/employees", authMiddleware, getEmployees); // Add this line

module.exports = router;
