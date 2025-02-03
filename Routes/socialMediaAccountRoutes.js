// Routes/socialMediaAccountRoutes.js
const express = require("express");
const socialMediaAccountController = require("../Controllers/socialMediaAccountController");
const {
  createSocialMediaAccount,
  getSocialMediaAccountsByUserId,
  updateSocialMediaAccount,
  deleteSocialMediaAccount,
} = socialMediaAccountController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSocialMediaAccount);
router.get("/user", authMiddleware, getSocialMediaAccountsByUserId);
router.put("/:id", authMiddleware, updateSocialMediaAccount);
router.delete("/:id", authMiddleware, deleteSocialMediaAccount);

module.exports = router;