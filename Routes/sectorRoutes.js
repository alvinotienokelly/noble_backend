// Routes/sectorRoutes.js
const express = require("express");
const sectorController = require("../Controllers/sectorController");
const {
  getAllSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  bulkUploadSectorsAndSubsectors,
} = sectorController;
const authMiddleware = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/bulkUpload");

const router = express.Router();

router.get("/", authMiddleware, getAllSectors);
router.get("/:id", authMiddleware, getSectorById);
router.post("/", authMiddleware, createSector);
router.put("/:id", authMiddleware, updateSector);
router.delete("/:id", authMiddleware, deleteSector);
router.post("/bulk-upload", authMiddleware, upload.single("file"), bulkUploadSectorsAndSubsectors); // Add this line

module.exports = router;
