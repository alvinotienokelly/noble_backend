const { dealMeetings } = require("../Models");
const db = require("../Models");
const Deal = db.deals;
const graphClient = require("../Middlewares/graphClient");
const axios = require("axios");

const scheduleDealMeeting = async (req, res) => {
  try {
    const { dealId, subject, startDateTime, endDateTime, attendees } = req.body;

    const deal = await Deal.findByPk(dealId);
    if (!deal) {
      res.status(200).json({
        status: false,
        message: "Deal not found.",
        meeting,
      });
    }

    //ToDo :: Integrate with Microsoft Graph API

    // const event = {
    //   subject,
    //   start: {
    //     dateTime: startDateTime,
    //     timeZone: "UTC",
    //   },
    //   end: {
    //     dateTime: endDateTime,
    //     timeZone: "UTC",
    //   },
    //   attendees: attendees.map((email) => ({
    //     emailAddress: {
    //       address: email,
    //       name: email,
    //     },
    //     type: "required",
    //   })),
    //   isOnlineMeeting: true,
    //   onlineMeetingProvider: "teamsForBusiness",
    // };

    // const response = await graphClient.api("/me/events").post(event);

    const meeting = await dealMeetings.create({
      deal_id: dealId,
      subject,
      start: startDateTime,
      end: endDateTime,
      attendees,
      meeting_link: "response.onlineMeeting.joinUrl", // Todo ::  intergration with Microsoft Graph API
    });

    res.status(200).json({
      status: true,
      message: "Meeting scheduled successfully.",
      meeting,
    });
  } catch (error) {
    res
      .status(200)
      .json({ status: false, message: "Error scheduling meeting." });
  }
};

const recordDealMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;

    // Call Read.ai API to start recording and transcription
    const response = await axios.post(
      "https://api.read.ai/v1/recordings",
      {
        meetingId,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.READ_AI_API_KEY}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error recording call:", error);
    res.status(500).json({ error: "Error recording call" });
  }
};

module.exports = {
  scheduleDealMeeting,
  recordDealMeeting,
};