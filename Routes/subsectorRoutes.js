// Routes/subsectorRoutes.js
const express = require("express");
const subsectorController = require("../Controllers/subsectorController");
const { getAllSubsectors, getSubsectorById, createSubsector, updateSubsector, deleteSubsector } = subsectorController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllSubsectors);
router.get("/:id", getSubsectorById);
router.post("/", createSubsector);
router.put("/:id", updateSubsector);
router.delete("/:id", deleteSubsector);

module.exports = router;