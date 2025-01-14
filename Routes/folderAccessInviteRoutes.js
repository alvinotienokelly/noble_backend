// Routes/folderAccessInviteRoutes.js
const express = require("express");
const folderAccessInviteController = require("../Controllers/folderAccessInviteController");
const {
  sendFolderAccessInvite,
  acceptFolderAccessInvite,
  rejectFolderAccessInvite,
  getFolderInvites,
} = folderAccessInviteController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/invite", authMiddleware, sendFolderAccessInvite);
router.put("/invite/:invite_id/accept", authMiddleware, acceptFolderAccessInvite);
router.put("/invite/:invite_id/reject", authMiddleware, rejectFolderAccessInvite);
router.get("/folder/:folder_id/invites", authMiddleware, getFolderInvites);

module.exports = router;