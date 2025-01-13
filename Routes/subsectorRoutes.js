// Routes/subsectorRoutes.js
const express = require("express");
const subsectorController = require("../Controllers/subsectorController");
const { getAllSubsectors, getSubsectorById, createSubsector, updateSubsector, deleteSubsector } = subsectorController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllSubsectors);
router.get("/:id", authMiddleware, getSubsectorById);
router.post("/", authMiddleware, createSubsector);
router.put("/:id", authMiddleware, updateSubsector);
router.delete("/:id", authMiddleware, deleteSubsector);

module.exports = router;