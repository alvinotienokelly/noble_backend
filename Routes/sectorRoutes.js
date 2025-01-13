// Routes/sectorRoutes.js
const express = require("express");
const sectorController = require("../Controllers/sectorController");
const { getAllSectors, getSectorById, createSector, updateSector, deleteSector } = sectorController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllSectors);
router.get("/:id", authMiddleware, getSectorById);
router.post("/", authMiddleware, createSector);
router.put("/:id", authMiddleware, updateSector);
router.delete("/:id", authMiddleware, deleteSector);

module.exports = router;