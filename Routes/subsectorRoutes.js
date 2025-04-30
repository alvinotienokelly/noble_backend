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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get("/", getAllSubsectors);
router.get("/sector/:sector_id", getSubsectorBySectorId); // Add this line
router.get("/:id", getSubsectorById);
router.post("/", checkPermissions(["CREATE_SUBSECTOR"]), createSubsector);
router.put("/:id", checkPermissions(["UPDATE_SUBSECTOR"]), updateSubsector);
router.delete("/:id", checkPermissions(["DELETE_SUBSECTOR"]), deleteSubsector);

module.exports = router;
