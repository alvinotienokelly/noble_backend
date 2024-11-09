// Routes/dealAccessInviteRoutes.js
const express = require("express");
const dealAccessInviteController = require("../Controllers/dealAccessInviteController");
const { sendDealAccessInvite, getInvestorInvites, getDealInvites, rejectDealInvite , acceptDealInvite} =
  dealAccessInviteController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/invite", authMiddleware, sendDealAccessInvite);
router.get("/invites", authMiddleware, getInvestorInvites);
router.get("/deal/:deal_id/invites", authMiddleware, getDealInvites);
router.put("/invite/:invite_id/accept", authMiddleware, acceptDealInvite); // Add this line
router.put("/invite/:invite_id/reject", authMiddleware, rejectDealInvite); // Add this line
module.exports = router;
