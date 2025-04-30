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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post("/", checkPermissions(["CREATE_REGION"]), createRegion);
router.get("/:id/with-countries", getRegionWithCountries);
router.get("/", getAllRegions);
router.put("/:id", checkPermissions(["UPDATE_REGION"]), updateRegion);
router.delete("/:id", checkPermissions(["DELETE_REGION"]), deleteRegion);

module.exports = router;
