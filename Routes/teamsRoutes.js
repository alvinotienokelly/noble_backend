// routes/teamsRoutes.js
const express = require("express");
const graphClient = require("../Middlewares/graphClient");
const axios = require("axios");
const teamsController = require("../Controllers/teamsController");
const {
  scheduleDealMeeting,
  recordDealMeeting,
  getMeetingsByDealId,
  updateDealMeeting,
  filterDealMeetings,
} = teamsController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

// Schedule a video call
router.post(
  "/schedule-call",
  authMiddleware,
  checkPermissions(["SCHEDULE_DEAL_MEETING", "EDIT_DEAL"]),
  scheduleDealMeeting
);
// Record and transcribe a call using Read.ai
router.post("/record-call", authMiddleware, recordDealMeeting);
// Get all meetings by deal ID
router.put(
  "/update-schedule-call/:meetingId",
  checkPermissions(["UPDATE_DEAL_MEETING", "EDIT_DEAL"]),
  updateDealMeeting
);
router.get("/deal/:dealId/meetings", authMiddleware, getMeetingsByDealId);
router.get("/filter-meetings", authMiddleware, filterDealMeetings);

module.exports = router;
