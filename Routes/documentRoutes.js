const express = require("express");
const documentController = require("../Controllers/documentController");
const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByUserDeals,
} = documentController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");
const fileUpload = require("../Middlewares/fileUpload");

const router = express.Router();

router.post("/", authMiddleware, fileUpload, createDocument);
router.get("/", authMiddleware, getAllDocuments);
router.get("/:id", authMiddleware, getDocumentById);
router.put("/:id", authMiddleware, checkAdmin, fileUpload, updateDocument);
router.delete("/:id", authMiddleware, checkAdmin, deleteDocument);
router.get("/user-deals/documents", authMiddleware, getDocumentsByUserDeals);

module.exports = router;
