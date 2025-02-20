// Controllers/dealAccessInviteController.js
const db = require("../Models");
const DealAccessInvite = db.deal_access_invite;
const User = db.users;
const Deal = db.deals;
const { sendEmail } = require("../Middlewares/emailService");
const { createAuditLog } = require("./auditLogService");
const InvestorMilestoneStatus = db.investor_milestone_statuses;
const InvestorMilestone = db.investor_milestones;

// Function to send deal access invite
const sendDealAccessInvite = async (req, res) => {
  try {
    const { investor_id, deal_id } = req.body;

    const investor = await User.findByPk(investor_id);
    const deal = await Deal.findByPk(deal_id);

    if (!investor) {
      return res
        .status(200)
        .json({ status: false, message: "Investor not found." });
    }

    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    const invite = await DealAccessInvite.create({
      investor_id,
      deal_id,
    });
    // Create audit log
    await createAuditLog({
      userId: req.user.id,
      action: "SEND_DEAL_ACCESS_INVITE",
      details: `Sent deal access invite to investor ${investor_id} for deal ${deal_id}`,
      ip_address: req.ip,
    });

    // Send email to investor
    const emailSubject = "Deal Access Invitation";
    const emailBody = `Hello ${investor.name},\n\nYou have been invited to access the deal "${deal.title}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    await sendEmail(investor.email, emailSubject, emailBody);

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to send deal access invite
const expressDealInterest = async (req, res) => {
  try {
    const { deal_id } = req.body;
    const investor_id = req.user.id; // Get the ID of the logged-in user

    const deal = await Deal.findByPk(deal_id);
    if (!deal) {
      return res
        .status(404)
        .json({ status: false, message: "Deal not found." });
    }

    const existingInvite = await DealAccessInvite.findOne({
      where: { investor_id, deal_id },
    });

    if (existingInvite) {
      return res
        .status(200)
        .json({ status: false, message: "Invite already exists." });
    }

    const invite = await DealAccessInvite.create({
      investor_id,
      deal_id,
    });

    // Fetch all InvestorMilestones
    const investorMilestones = await InvestorMilestone.findAll();

    // Loop through all InvestorMilestones and create InvestorMilestoneStatus records
    for (const milestone of investorMilestones) {
      await InvestorMilestoneStatus.create({
        investor_milestone_id: milestone.milestone_id,
        user_id: investor_id,
        deal_id: deal_id,
        status: "Pending",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "EXPRESS_DEAL_INTEREST",
      details: `Investor ${investor_id} expressed interest in deal ${deal_id}`,
      ip_address: req.ip,
    });
    // Send email to user
    const emailSubject = "Deal Access Invitation";
    const emailBody = `Hello,\n\nYou have been invited to access the deal "${deal.title}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    // await sendEmail(user_email, emailSubject, emailBody);

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//Function to get invites for a deal
const getDealInvites = async (req, res) => {
  try {
    const deal_id = req.params.deal_id;

    const invites = await DealAccessInvite.findAll({
      where: { deal_id },
      include: [{ model: User, as: "investor" }],
    });
    await createAuditLog({
      userId: req.user.id,
      action: "GET_DEAL_INVITES",
      details: `Fetched invites for deal ${deal_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, invites });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to get all invites for an investor
const getInvestorInvites = async (req, res) => {
  try {
    const investor_id = req.user.id;

    const invites = await DealAccessInvite.findAll({
      where: { investor_id },
      include: [{ model: Deal, as: "deal" }],
    });

    await createAuditLog({
      userId: req.user.id,
      action: "GET_INVESTOR_INVITES",
      details: `Fetched invites for investor ${investor_id}`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, invites });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to accept a deal invite
const acceptDealInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await DealAccessInvite.findByPk(invite_id);

    if (!invite) {
      return res
        .status(200)
        .json({ status: false, message: "Invite not found." });
    }

    // if (invite.investor_id !== req.user.id) {
    //   return res.status(200).json({ status: false, message: "Access denied." });
    // }

    invite.status = "Accepted";
    await invite.save();

    await createAuditLog({
      userId: req.user.id,
      action: "ACCEPT_DEAL_INVITE",
      details: `Investor ${req.user.id} accepted invite ${invite_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to reject a deal invite
const rejectDealInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await DealAccessInvite.findByPk(invite_id);

    if (!invite) {
      return res
        .status(200)
        .json({ status: false, message: "Invite not found." });
    }

    if (invite.investor_id !== req.user.id) {
      return res.status(200).json({ status: false, message: "Access denied." });
    }

    invite.status = "Rejected";
    await invite.save();
    await createAuditLog({
      userId: req.user.id,
      action: "REJECT_DEAL_INVITE",
      details: `Investor ${req.user.id} rejected invite ${invite_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to check if the logged-in user has a DealAccessInvite for a deal that is Accepted
const checkAcceptedDealAccessInvite = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { deal_id } = req.body;

    const invite = await DealAccessInvite.findOne({
      where: { investor_id: user_id, deal_id, status: "Accepted" },
    });

    if (!invite) {
      return res
        .status(200)
        .json({
          status: false,
          message: "No accepted invite found for this deal.",
        });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "CHECK_ACCEPTED_DEAL_ACCESS_INVITE",
      details: `Checked accepted deal access invite for deal ${deal_id}`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({ status: true, message: "Accepted invite found for this deal." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  sendDealAccessInvite,
  getInvestorInvites,
  getDealInvites,
  rejectDealInvite,
  acceptDealInvite,
  expressDealInterest,
  checkAcceptedDealAccessInvite,
};
