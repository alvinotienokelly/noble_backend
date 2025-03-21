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

router.get("/", getAllSectors);
router.get("/:id", getSectorById);
router.post("/", createSector);
router.put("/:id", updateSector);
router.delete("/:id", deleteSector);
router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkUploadSectorsAndSubsectors
); // Add this line

module.exports = router;
