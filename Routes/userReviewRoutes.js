// Routes/userReviewRoutes.js
const express = require("express");
const userReviewController = require("../Controllers/userReviewController");
const {
  createUserReview,
  getUserReviews,
  getUserReviewById,
  updateUserReview,
  deleteUserReview,
} = userReviewController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createUserReview);
router.get("/", authMiddleware, getUserReviews);
router.get("/:id", authMiddleware, getUserReviewById);
router.put("/:id", authMiddleware, updateUserReview);
router.delete("/:id", authMiddleware, deleteUserReview);

module.exports = router;