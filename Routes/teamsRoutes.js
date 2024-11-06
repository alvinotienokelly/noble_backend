// routes/teamsRoutes.js
const express = require('express');
const graphClient = require('../Middlewares/graphClient');
const axios = require('axios');

const router = express.Router();

// Schedule a video call
router.post('/schedule-call', async (req, res) => {
  try {
    const { subject, startDateTime, endDateTime, attendees } = req.body;

    const event = {
      subject,
      start: {
        dateTime: startDateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'UTC',
      },
      attendees: attendees.map(email => ({
        emailAddress: {
          address: email,
          name: email,
        },
        type: 'required',
      })),
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
    };

    let userDetails = await graphClient.api("/me").get();
	console.log(userDetails);

    const response = await graphClient.api('/me/events').post(event);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error scheduling call:', error);
    res.status(500).json({ error: 'Error scheduling call' });
  }
});

// Record and transcribe a call using Read.ai
router.post('/record-call', async (req, res) => {
  try {
    const { meetingId } = req.body;

    // Call Read.ai API to start recording and transcription
    const response = await axios.post('https://api.read.ai/v1/recordings', {
      meetingId,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.READ_AI_API_KEY}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error recording call:', error);
    res.status(500).json({ error: 'Error recording call' });
  }
});

module.exports = router;