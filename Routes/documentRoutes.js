const express = require("express");
const documentController = require("../Controllers/documentController");
const { createDocument, getAllDocuments, getDocumentById, updateDocument, deleteDocument } = documentController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");

const router = express.Router();

router.post("/", authMiddleware, createDocument);
router.get("/", authMiddleware, getAllDocuments);
router.get("/:id", authMiddleware, getDocumentById);
router.put("/:id", authMiddleware, checkAdmin, updateDocument);
router.delete("/:id", authMiddleware, checkAdmin, deleteDocument);

module.exports = router;