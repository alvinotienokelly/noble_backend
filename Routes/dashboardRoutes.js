// Routes/dashboardRoutes.js
const express = require("express");
const dashboardController = require("../Controllers/dashboardController");
const { getDashboardDealStatusData, getDashboardDealTypeData } = dashboardController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardDealStatusData);
router.get("/type", authMiddleware, getDashboardDealTypeData);

module.exports = router;