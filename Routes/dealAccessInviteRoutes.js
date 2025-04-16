// Routes/dealAccessInviteRoutes.js
const express = require("express");
const dealAccessInviteController = require("../Controllers/dealAccessInviteController");
const {
  sendDealAccessInvite,
  getInvestorInvites,
  getDealInvites,
  rejectDealInvite,
  acceptDealInvite,
  expressDealInterest,
  checkAcceptedDealAccessInvite,
  withdrawDealInterest,
} = dealAccessInviteController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/invite", authMiddleware, sendDealAccessInvite);
router.post(
  "/check-accepted-invite",
  authMiddleware,
  checkAcceptedDealAccessInvite
); // Add this line
router.get("/invites", authMiddleware, getInvestorInvites);
router.get("/deal/:deal_id/invites", authMiddleware, getDealInvites);
router.put("/invite/:invite_id/accept", authMiddleware, acceptDealInvite); // Add this line
router.put("/invite/:invite_id/reject", authMiddleware, rejectDealInvite); // Add this line
router.post("/interest", authMiddleware, expressDealInterest);
router.put(
  "/deals/:deal_id/withdraw-interest",
  authMiddleware,
  withdrawDealInterest
);

module.exports = router;
