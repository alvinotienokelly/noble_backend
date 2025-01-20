// Routes/dealCountryRoutes.js
const express = require("express");
const dealCountryController = require("../Controllers/dealCountryController");
const { addCountryToDeal, getCountriesForDeal, removeCountryFromDeal } = dealCountryController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addCountryToDeal);
router.get("/:deal_id/countries", authMiddleware, getCountriesForDeal);
router.delete("/remove", authMiddleware, removeCountryFromDeal);

module.exports = router;