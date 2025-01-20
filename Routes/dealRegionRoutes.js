// Routes/dealRegionRoutes.js
const express = require("express");
const dealRegionController = require("../Controllers/dealRegionController");
const { addRegionToDeal, getRegionsForDeal, removeRegionFromDeal } = dealRegionController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addRegionToDeal);
router.get("/:deal_id/regions", authMiddleware, getRegionsForDeal);
router.delete("/remove", authMiddleware, removeRegionFromDeal);

module.exports = router;