// Routes/documentShareRoutes.js
const express = require("express");
const documentShareController = require("../Controllers/documentShareController");
const {
  shareDocument,
  acceptDocumentShare,
  rejectDocumentShare,
  getDocumentShares,
} = documentShareController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/share",
  authMiddleware,
  checkPermission("SHARE_DOCUMENT"),

  shareDocument
);
router.put("/share/:share_id/accept", authMiddleware, acceptDocumentShare);
router.put("/share/:share_id/reject", authMiddleware, rejectDocumentShare);
router.get(
  "/document/:document_id/shares",
  authMiddleware,
  checkPermission("VIEW_DOCUMENT_SHARES"),

  getDocumentShares
);

module.exports = router;
