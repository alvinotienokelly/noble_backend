const { dealMeetings } = require("../Models");
const db = require("../Models");
const Deal = db.deals;
const graphClient = require("../Middlewares/graphClient");
const axios = require("axios");
const { Op } = require("sequelize");

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

const updateDealMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params; // Meeting ID to identify the meeting
    const { subject, startDateTime, endDateTime, attendees } = req.body;

    // Find the meeting by ID
    const meeting = await dealMeetings.findByPk(meetingId);

    if (!meeting) {
      return res.status(404).json({
        status: false,
        message: "Meeting not found.",
      });
    }

    // Update the meeting details
    await meeting.update({
      subject: subject || meeting.subject,
      start: startDateTime || meeting.start,
      end: endDateTime || meeting.end,
      attendees: attendees || meeting.attendees,
    });

    res.status(200).json({
      status: true,
      message: "Meeting updated successfully.",
      meeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const filterDealMeetings = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      subject,
      attendee,
      page = 1,
      limit = 10,
    } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (startDate) {
      whereClause.start = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      whereClause.end = { [Op.lte]: new Date(endDate) };
    }

    if (subject) {
      whereClause.subject = { [Op.like]: `%${subject}%` };
    }

    if (attendee) {
      whereClause.attendees = { [Op.contains]: [attendee] };
    }

    const { count: totalMeetings, rows: meetings } =
      await dealMeetings.findAndCountAll({
        where: whereClause,
        order: [["start", "ASC"]],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalMeetings / limit);

    if (!meetings || meetings.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No meetings found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalMeetings,
      totalPages,
      currentPage: parseInt(page),
      meetings,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getMeetingsByDealId = async (req, res) => {
  try {
    const { dealId } = req.params;

    const meetings = await dealMeetings.findAll({
      where: { deal_id: dealId },
      order: [["start", "ASC"]],
    });

    if (!meetings || meetings.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No meetings found for this deal.",
      });
    }

    res.status(200).json({ status: true, meetings: meetings });
  } catch (error) {
    res
      .status(200)
      .json({ status: false, message: "Error fetching meetings." });
  }
};

module.exports = {
  scheduleDealMeeting,
  recordDealMeeting,
  getMeetingsByDealId,
  filterDealMeetings,
  updateDealMeeting,
};
