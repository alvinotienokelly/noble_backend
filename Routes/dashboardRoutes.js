// Routes/dashboardRoutes.js
const express = require("express");
const dashboardController = require("../Controllers/dashboardController");
const { getDashboardDealStatusData } = dashboardController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardDealStatusData);

module.exports = router;