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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_DOCUMENT_TYPE"),

  createDocumentType
);
router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_DOCUMENT_TYPES"),

  getAllDocumentTypes
);
router.get("/:id", authMiddleware, getDocumentTypeById);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_DOCUMENT_TYPE"),

  updateDocumentType
);
router.delete("/:id", authMiddleware, deleteDocumentType);

module.exports = router;
