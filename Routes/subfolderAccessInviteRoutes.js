// Routes/subfolderAccessInviteRoutes.js
const express = require("express");
const subfolderAccessInviteController = require("../Controllers/subfolderAccessInviteController");
const {
  sendSubfolderAccessInvite,
  acceptSubfolderAccessInvite,
  rejectSubfolderAccessInvite,
  getSubfolderInvites,
} = subfolderAccessInviteController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/invite", authMiddleware, sendSubfolderAccessInvite);
router.put(
  "/invite/:invite_id/accept",
  authMiddleware,
  acceptSubfolderAccessInvite
);
router.put(
  "/invite/:invite_id/reject",
  authMiddleware,
  rejectSubfolderAccessInvite
);
router.get(
  "/subfolder/:subfolder_id/invites",
  authMiddleware,
  getSubfolderInvites
);

module.exports = router;
