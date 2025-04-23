// Routes/regionRoutes.js
const express = require("express");
const regionController = require("../Controllers/regionController");
const {
  createRegion,
  getAllRegions,
  updateRegion,
  deleteRegion,
  getRegionWithCountries,
} = regionController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post("/", checkPermission("CREATE_REGION"), createRegion);
router.get("/:id/with-countries", getRegionWithCountries);
router.get("/", getAllRegions);
router.put("/:id", checkPermission("UPDATE_REGION"), updateRegion);
router.delete("/:id", checkPermission("DELETE_REGION"), deleteRegion);

module.exports = router;
