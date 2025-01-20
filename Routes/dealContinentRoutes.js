// Routes/dealContinentRoutes.js
const express = require("express");
const dealContinentController = require("../Controllers/dealContinentController");
const { addContinentToDeal, getContinentsForDeal, removeContinentFromDeal } = dealContinentController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addContinentToDeal);
router.get("/:deal_id/continents", authMiddleware, getContinentsForDeal);
router.delete("/remove", authMiddleware, removeContinentFromDeal);

module.exports = router;