const express = require("express");
const dealController = require("../Controllers/dealController");
const { createDeal, getAllDeals, getDealById, updateDeal, deleteDeal } = dealController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDeal);
router.get("/", authMiddleware, getAllDeals);
router.get("/:id", authMiddleware, getDealById);
router.put("/:id", authMiddleware, updateDeal);
router.delete("/:id", authMiddleware, deleteDeal);

module.exports = router;