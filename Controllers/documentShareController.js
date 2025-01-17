// Controllers/documentShareController.js
const db = require("../Models");
const DocumentShare = db.document_shares;
const Document = db.documents;
const { sendEmail } = require("../Middlewares/emailService");

// Function to share a document
const shareDocument = async (req, res) => {
  try {
    const { document_id, user_email } = req.body;

    const document = await Document.findByPk(document_id);
    if (!document) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found." });
    }

    const share = await DocumentShare.create({
      document_id,
      user_email,
    });

    // Send email to user
    const emailSubject = "Document Access Invitation";
    const emailBody = `Hello,\n\nYou have been invited to access the document "${document.file_name}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    await sendEmail(user_email, emailSubject, emailBody);

    res.status(200).json({ status: true, share });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to accept a document share
const acceptDocumentShare = async (req, res) => {
  try {
    const share_id = req.params.share_id;
    const share = await DocumentShare.findByPk(share_id);

    if (!share) {
      return res
        .status(404)
        .json({ status: false, message: "Share not found." });
    }

    share.status = "Accepted";
    await share.save();

    res.status(200).json({ status: true, share });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to reject a document share
const rejectDocumentShare = async (req, res) => {
  try {
    const share_id = req.params.share_id;
    const share = await DocumentShare.findByPk(share_id);

    if (!share) {
      return res
        .status(404)
        .json({ status: false, message: "Share not found." });
    }

    share.status = "Rejected";
    await share.save();

    res.status(200).json({ status: true, share });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to get all shares for a document
const getDocumentShares = async (req, res) => {
  try {
    const document_id = req.params.document_id;

    const shares = await DocumentShare.findAll({
      where: { document_id },
      include: [{ model: Document, as: "document" }],
    });

    res.status(200).json({ status: true, shares });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  shareDocument,
  acceptDocumentShare,
  rejectDocumentShare,
  getDocumentShares,
};
