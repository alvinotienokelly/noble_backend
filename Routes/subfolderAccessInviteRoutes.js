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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/invite",
  authMiddleware,
  checkPermissions(["SEND_SUBFOLDER_ACCESS_INVITE"]),
  sendSubfolderAccessInvite
);
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
  checkPermissions(["GET_SUBFOLDER_INVITES"]),
  getSubfolderInvites
);

module.exports = router;
