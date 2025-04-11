// Routes/subsectorRoutes.js
const express = require("express");
const subsectorController = require("../Controllers/subsectorController");
const {
  getAllSubsectors,
  getSubsectorById,
  createSubsector,
  getSubsectorBySectorId, // Add this line
  updateSubsector,
  deleteSubsector,
} = subsectorController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllSubsectors);
router.get("/sector/:sector_id", getSubsectorBySectorId); // Add this line
router.get("/:id", getSubsectorById);
router.post("/", createSubsector);
router.put("/:id", updateSubsector);
router.delete("/:id", deleteSubsector);

module.exports = router;
