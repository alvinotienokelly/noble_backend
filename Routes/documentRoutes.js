const express = require("express");
const documentController = require("../Controllers/documentController");
const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByUserDeals,
  documentsFilter,
  archiveDocument, // Add this line
  getDocumentsForUserWithShareStatus, // Add this line
} = documentController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");
const fileUpload = require("../Middlewares/fileUpload");

const router = express.Router();

router.post("/", authMiddleware, fileUpload, createDocument);
router.get("/", authMiddleware, getAllDocuments);
router.get(
  "/user/documents",
  authMiddleware,
  getDocumentsForUserWithShareStatus
); // Add this line
router.get("/:id", authMiddleware, getDocumentById);
router.put("/:id", authMiddleware, checkAdmin, fileUpload, updateDocument);
router.delete("/:id", authMiddleware, checkAdmin, deleteDocument);
router.get("/user-deals/documents", authMiddleware, getDocumentsByUserDeals);
router.get("/filter/documents", authMiddleware, documentsFilter);
router.put("/:id/archive", authMiddleware, archiveDocument); // Add this line

module.exports = router;
