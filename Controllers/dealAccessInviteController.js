// Controllers/dealAccessInviteController.js
const db = require("../Models");
const DealAccessInvite = db.deal_access_invite;
const User = db.users;
const Deal = db.deals;
const { sendEmail } = require("../Middlewares/emailService");

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

    // Send email to investor
    const emailSubject = "Deal Access Invitation";
    const emailBody = `Hello ${investor.name},\n\nYou have been invited to access the deal "${deal.title}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    await sendEmail(investor.email, emailSubject, emailBody);

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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

    if (invite.investor_id !== req.user.id) {
      return res.status(200).json({ status: false, message: "Access denied." });
    }

    invite.status = "Accepted";
    await invite.save();

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

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  sendDealAccessInvite,
  getInvestorInvites,
  getDealInvites,
  rejectDealInvite,
  acceptDealInvite
};
