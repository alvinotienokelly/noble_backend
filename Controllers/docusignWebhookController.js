// Controllers/docusignWebhookController.js
const db = require("../Models");
const Document = db.documents;
const SignatureRecord = db.signature_record;

const handleWebhook = async (req, res) => {
  try {
    const { envelopeId, status, recipients } = req.body;

    if (status === "completed") {
      const document = await Document.findOne({ where: { docusign_envelope_id: envelopeId } });
      if (document) {
        // document.signed = true;
        // document.signed_date = new Date();
        // await document.save();

        // Create signature records for each recipient
        for (const recipient of recipients.signers) {
          await SignatureRecord.create({
            document_id: document.document_id,
            deal_id: document.deal_id,
            user_id: recipient.clientUserId, // Assuming clientUserId is set to the user ID
            signed_date: new Date(),
          });
        }
      }
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = { handleWebhook };