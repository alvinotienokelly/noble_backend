// Controllers/folderAccessInviteController.js
const db = require("../Models");
const FolderAccessInvite = db.folder_access_invite;
const Folder = db.folders;
const User = db.users;
const { sendEmail } = require("../Middlewares/emailService");

// Function to send folder access invite
const sendFolderAccessInvite = async (req, res) => {
  try {
    const { folder_id, user_email } = req.body;

    const folder = await Folder.findByPk(folder_id);
    if (!folder) {
      return res
        .status(404)
        .json({ status: false, message: "Folder not found." });
    }

    const invite = await FolderAccessInvite.create({
      folder_id,
      user_email,
    });

    // Send email to user
    const emailSubject = "Folder Access Invitation";
    const emailBody = `Hello,\n\nYou have been invited to access the folder "${folder.name}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    await sendEmail(user_email, emailSubject, emailBody);

    res.status(200).json({ status: true, invite });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to accept a folder access invite
const acceptFolderAccessInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await FolderAccessInvite.findByPk(invite_id);

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

// Function to reject a folder access invite
const rejectFolderAccessInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const invite = await FolderAccessInvite.findByPk(invite_id);

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

// Function to get all invites for a folder
const getFolderInvites = async (req, res) => {
  try {
    const folder_id = req.params.folder_id;

    const invites = await FolderAccessInvite.findAll({
      where: { folder_id },
    });

    res.status(200).json({ status: true, invites });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  sendFolderAccessInvite,
  acceptFolderAccessInvite,
  rejectFolderAccessInvite,
  getFolderInvites,
};
