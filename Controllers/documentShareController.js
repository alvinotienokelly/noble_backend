// Controllers/documentShareController.js
const db = require("../Models");
const DocumentShare = db.document_shares;
const Document = db.documents;
const { sendEmail } = require("../Middlewares/emailService");
const { createAuditLog } = require("./auditLogService");
const { createNotification } = require("./notificationController");
const { createEnvelope } = require("../Middlewares/docusignService");

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

    // If the document requires a signature, create a DocuSign envelope
    if (document.requires_signature) {
      const envelopeId = await createEnvelope({
        file_path: document.file_path,
        file_name: document.file_name,
        file_type: document.file_type || "pdf", // Default to PDF if not specified
        recipientEmail: user_email,
        recipientName: "Recipient Name", // Replace with the recipient's name if available
      });

      // Update the document with the DocuSign envelope ID
      document.docusign_envelope_id = envelopeId;
      await document.save();
    }


    // Send email to user
    const emailSubject = "Document Access Invitation";
    const emailBody = `Hello,\n\nYou have been invited to access the document "${document.file_name}". Please log in to your account to view the details.\n\nBest regards,\nYour Team`;
    // await sendEmail(user_email, emailSubject, emailBody);

    await createAuditLog({
      action: "SHARE_DOCUMENT",
      ip_address: req.ip,
      userId: req.user.id,
      description: `Document "${document.file_name}" shared with ${user_email}.`,
    });

    const user = await db.users.findOne({ where: { email: user_email } });

    // await createNotification(
    //   user.id,
    //   "Document Access Invitation",
    //   "You have been invited to access a document. " + document.file_name
    // );
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

    await createAuditLog({
      action: "ACCEPT_DOCUMENT_SHARE",
      ip_address: req.ip,
      userId: req.user.id,
      description: `Document share with ID ${share_id} accepted.`,
    });

    const document = await Document.findByPk(share.document_id);
    await createNotification(
      req.user.id,
      "Document Share Accepted",
      `You have accepted the document share for "${document.file_name}".`
    );

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
    await createAuditLog({
      action: "REJECT_DOCUMENT_SHARE",
      ip_address: req.ip,
      userId: req.user.id,
      description: `Document share with ID ${share_id} rejected.`,
    });

    const document = await Document.findByPk(share.document_id);
    await createNotification(
      req.user.id,
      "Document Share Rejected",
      `You have rejected the document share for "${document.file_name}".`
    );

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

    await createAuditLog({
      action: "GET_DOCUMENT_SHARES",
      ip_address: req.ip,
      userId: req.user.id,
      description: `Fetched shares for document ID ${document_id}.`,
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
