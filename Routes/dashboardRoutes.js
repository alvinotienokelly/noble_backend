// Routes/dashboardRoutes.js
const express = require("express");
const dashboardController = require("../Controllers/dashboardController");
const {
  getDashboardDealStatusData,
  getDashboardDealTypeData,
  getDashboardDealSectorData,
  getDashboardDealSizeData,
  getDashboardDealConsultantStatusData,
} = dashboardController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardDealStatusData);
router.get("/type", authMiddleware, getDashboardDealTypeData);
router.get("/sector", authMiddleware, getDashboardDealSectorData);
router.get("/size", authMiddleware, getDashboardDealSizeData);
router.get("/consultant", authMiddleware, getDashboardDealConsultantStatusData);

module.exports = router;
