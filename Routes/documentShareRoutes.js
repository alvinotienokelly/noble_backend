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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/share",
  authMiddleware,
  checkPermissions([
    "SHARE_DOCUMENT",
    "EDIT_DOCUMENT",
    "EDIT_DEAL",
    "UPDATE_DEAL",
  ]),

  shareDocument
);
router.put("/share/:share_id/accept", authMiddleware, acceptDocumentShare);
router.put("/share/:share_id/reject", authMiddleware, rejectDocumentShare);
router.get(
  "/document/:document_id/shares",
  authMiddleware,
  checkPermissions([
    "VIEW_DOCUMENT_SHARES",
    "EDIT_DOCUMENT",
    "EDIT_DEAL",
    "UPDATE_DEAL",
  ]),

  getDocumentShares
);

module.exports = router;
