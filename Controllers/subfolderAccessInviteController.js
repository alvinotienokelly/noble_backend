// Controllers/subfolderAccessInviteController.js
const db = require("../Models");
const SubfolderAccessInvite = db.subfolder_access_invite;
const Subfolder = db.subfolders;
const { sendEmail } = require("../Middlewares/emailService");

// Function to send subfolder access invite
const sendSubfolderAccessInvite = async (req, res) => {
  try {
    const { subfolder_id, user_email } = req.body;

    const subfolder = await Subfolder.findByPk(subfolder_id);
    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    const invite = await SubfolderAccessInvite.create({
      subfolder_id,
      user_email,
    });

    // Send email to user
    const emailSubject = "Subfolder Access Invitation";
    const emailBody = `Hello,\n\nYou have been invited to access the subfolder "${subfolder.name}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    await sendEmail(user_email, emailSubject, emailBody);

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to accept a subfolder access invite
const acceptSubfolderAccessInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await SubfolderAccessInvite.findByPk(invite_id);

    if (!invite) {
      return res
        .status(404)
        .json({ status: false, message: "Invite not found." });
    }

    invite.status = "Accepted";
    await invite.save();

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to reject a subfolder access invite
const rejectSubfolderAccessInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await SubfolderAccessInvite.findByPk(invite_id);

    if (!invite) {
      return res
        .status(404)
        .json({ status: false, message: "Invite not found." });
    }

    invite.status = "Rejected";
    await invite.save();

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to get all invites for a subfolder
const getSubfolderInvites = async (req, res) => {
  try {
    const subfolder_id = req.params.subfolder_id;

    const invites = await SubfolderAccessInvite.findAll({
      where: { subfolder_id },
    include: [
        {
            model: Subfolder,
            as: 'subfolder',
            attributes: ['name']
        }
    ]
    });

    res.status(200).json({ status: true, invites });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  sendSubfolderAccessInvite,
  acceptSubfolderAccessInvite,
  rejectSubfolderAccessInvite,
  getSubfolderInvites,
};
