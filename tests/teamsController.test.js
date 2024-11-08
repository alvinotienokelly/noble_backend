// __tests__/teamsController.test.js
const { scheduleDealMeeting } = require("../Controllers/teamsController");
const db = require("../Models");
const Deal = db.deals;
const DealMeeting = db.dealMeetings;

jest.mock("../Models", () => ({
  deals: {
    findByPk: jest.fn(),
  },
  dealMeetings: {
    create: jest.fn(),
  },
}));

describe("scheduleDealMeeting", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        dealId: "deal-id-123",
        subject: "Test Meeting",
        startDateTime: "2023-10-01T10:00:00Z",
        endDateTime: "2023-10-01T11:00:00Z",
        attendees: ["attendee1@example.com", "attendee2@example.com"],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should schedule a meeting successfully", async () => {
    Deal.findByPk.mockResolvedValue({
      deal_id: "deal-id-123",
    });

    DealMeeting.create.mockResolvedValue({
      meeting_id: "meeting-id-123",
      deal_id: "deal-id-123",
      subject: "Test Meeting",
      start: "2023-10-01T10:00:00Z",
      end: "2023-10-01T11:00:00Z",
      attendees: ["attendee1@example.com", "attendee2@example.com"],
      meeting_link: "https://teams.microsoft.com/l/meetup-join/meeting-id-123",
    });

    await scheduleDealMeeting(req, res);

    expect(Deal.findByPk).toHaveBeenCalledWith("deal-id-123");
    expect(DealMeeting.create).toHaveBeenCalledWith({
      deal_id: "deal-id-123",
      subject: "Test Meeting",
      start: "2023-10-01T10:00:00Z",
      end: "2023-10-01T11:00:00Z",
      attendees: ["attendee1@example.com", "attendee2@example.com"],
      meeting_link: "response.onlineMeeting.joinUrl",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Meeting scheduled successfully.",
      meeting: {
        meeting_id: "meeting-id-123",
        deal_id: "deal-id-123",
        subject: "Test Meeting",
        start: "2023-10-01T10:00:00Z",
        end: "2023-10-01T11:00:00Z",
        attendees: ["attendee1@example.com", "attendee2@example.com"],
        meeting_link:
          "https://teams.microsoft.com/l/meetup-join/meeting-id-123",
      },
    });
  });

  it("should return an error if the deal is not found", async () => {
    Deal.findByPk.mockResolvedValue(null);

    await scheduleDealMeeting(req, res);

    expect(Deal.findByPk).toHaveBeenCalledWith("deal-id-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Error scheduling meeting.",
    });
  });

  it("should return an error if there is an exception", async () => {
    Deal.findByPk.mockRejectedValue(new Error("Database error"));

    await scheduleDealMeeting(req, res);

    expect(Deal.findByPk).toHaveBeenCalledWith("deal-id-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Error scheduling meeting.",
    });
  });
});
