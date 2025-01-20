// Routes/regionRoutes.js
const express = require("express");
const regionController = require("../Controllers/regionController");
const { createRegion, getAllRegions, updateRegion, deleteRegion } = regionController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRegion);
router.get("/", authMiddleware, getAllRegions);
router.put("/:id", authMiddleware, updateRegion);
router.delete("/:id", authMiddleware, deleteRegion);

module.exports = router;