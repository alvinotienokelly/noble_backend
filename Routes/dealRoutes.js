const express = require("express");
const dealController = require("../Controllers/dealController");
const {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getDealsByUserPreferences,
} = dealController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");

const router = express.Router();

router.post("/", authMiddleware, checkAdmin, createDeal);
router.get("/", authMiddleware, getAllDeals);
router.get("/:id", authMiddleware, getDealById);
router.put("/:id", authMiddleware, checkAdmin, updateDeal);
router.delete("/:id", authMiddleware, deleteDeal);
router.get("/user/preferences", authMiddleware, getDealsByUserPreferences);

module.exports = router;
