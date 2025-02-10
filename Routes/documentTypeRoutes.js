// Routes/documentTypeRoutes.js
const express = require("express");
const documentTypeController = require("../Controllers/documentTypeController");
const {
  createDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
} = documentTypeController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDocumentType);
router.get("/", authMiddleware, getAllDocumentTypes);
router.get("/:id", authMiddleware, getDocumentTypeById);
router.put("/:id", authMiddleware, updateDocumentType);
router.delete("/:id", authMiddleware, deleteDocumentType);

module.exports = router;