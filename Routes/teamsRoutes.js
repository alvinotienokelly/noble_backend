// routes/teamsRoutes.js
const express = require("express");
const graphClient = require("../Middlewares/graphClient");
const axios = require("axios");
const teamsController = require("../Controllers/teamsController");
const { scheduleDealMeeting, recordDealMeeting } = teamsController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkAdmin = require("../Middlewares/checkAdmin");

const router = express.Router();

// Schedule a video call
router.post("/schedule-call", authMiddleware, scheduleDealMeeting);
// Record and transcribe a call using Read.ai
router.post("/record-call", authMiddleware, recordDealMeeting);

module.exports = router;
