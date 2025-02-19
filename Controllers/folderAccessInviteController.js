// Controllers/folderAccessInviteController.js
const db = require("../Models");
const FolderAccessInvite = db.folder_access_invite;
const Folder = db.folders;
const User = db.users;
const { sendEmail } = require("../Middlewares/emailService");
const { createAuditLog } = require("./auditLogService");

// Function to send folder access invite
const sendFolderAccessInvite = async (req, res) => {
  try {
    const { folder_id, user_emails } = req.body;

    if (!Array.isArray(user_emails) || user_emails.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user emails provided." });
    }

    const folder = await Folder.findByPk(folder_id);
    if (!folder) {
      return res
        .status(404)
        .json({ status: false, message: "Folder not found." });
    }

    const invites = await Promise.all(
      user_emails.map(async (user_email) => {
        const invite = await FolderAccessInvite.create({
          folder_id,
          user_email,
        });

        // Send email to user
        const emailSubject = "Folder Access Invitation";
        const emailBody = `Hello,\n\nYou have been invited to access the folder "${folder.name}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
        await sendEmail(user_email, emailSubject, emailBody);

        await createAuditLog({
          action: "SEND_FOLDER_ACCESS_INVITE",
          description: `Invite sent to ${user_email} for folder ${folder.name}`,
          userId: req.user.id,
          ip_address: req.ip,
        });

        return invite;
      })
    );

    res.status(200).json({ status: true, invites });
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

    await createAuditLog({
      action: "ACCEPT_FOLDER_ACCESS_INVITE",
      description: `Invite accepted by ${req.user.email} for folder ${invite.folder_id}`,
      userId: req.user.id,
      ip_address: req.ip,
    });

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

    await createAuditLog({
      action: "REJECT_FOLDER_ACCESS_INVITE",
      description: `Invite rejected by ${req.user.email} for folder ${invite.folder_id}`,
      userId: req.user.id,
      ip_address: req.ip,
    });

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

    await createAuditLog({
      action: "GET_FOLDER_INVITES",
      description: `Fetched invites for folder ${folder_id}`,
      userId: req.user.id,
      ip_address: req.ip,
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
