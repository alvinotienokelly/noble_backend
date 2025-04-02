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

const router = express.Router();

router.post("/", createRegion);
router.get("/:id/with-countries", getRegionWithCountries);
router.get("/", getAllRegions);
router.put("/:id", updateRegion);
router.delete("/:id", deleteRegion);

module.exports = router;
