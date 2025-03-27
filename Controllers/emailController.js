// Controllers/emailController.js
const { sendEmail } = require("../Middlewares/communicationService");

const sendTestEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({
        status: false,
        message: "Please provide 'to', 'subject', and 'text' fields.",
      });
    }

    const result = await sendEmail(to, subject, text, html);

    if (result.status) {
      return res.status(200).json({
        status: true,
        message: result.message,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in sendTestEmail:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { sendTestEmail };
