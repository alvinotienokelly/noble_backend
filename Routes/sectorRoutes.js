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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get("/", getAllSectors);
router.get("/:id", getSectorById);
router.post("/", checkPermissions(["CREATE_SECTOR"]), createSector);
router.put("/:id", checkPermissions(["UPDATE_SECTOR"]), updateSector);
router.delete("/:id", checkPermissions(["DELETE_SECTOR"]), deleteSector);
router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkUploadSectorsAndSubsectors
); // Add this line

module.exports = router;
