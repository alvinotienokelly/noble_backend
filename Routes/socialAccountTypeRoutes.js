// Routes/socialAccountTypeRoutes.js
const express = require("express");
const socialAccountTypeController = require("../Controllers/socialAccountTypeController");
const {
  createSocialAccountType,
  getAllSocialAccountTypes,
  getSocialAccountTypeById,
  updateSocialAccountType,
  deleteSocialAccountType,
} = socialAccountTypeController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSocialAccountType);
router.get("/", authMiddleware, getAllSocialAccountTypes);
router.get("/:id", authMiddleware, getSocialAccountTypeById);
router.put("/:id", authMiddleware, updateSocialAccountType);
router.delete("/:id", authMiddleware, deleteSocialAccountType);

module.exports = router;