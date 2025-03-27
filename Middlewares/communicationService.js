// Middlewares/emailService.js
const nodemailer = require("nodemailer");

// Configure the transporter for Office 365
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Office 365 SMTP server
  port: 587, // Port for TLS
  secure: false, // Use TLS (not SSL)
  auth: {
    user: process.env.OFFICE365_EMAIL, // Your Office 365 email address
    pass: process.env.OFFICE365_PASSWORD, // Your Office 365 email password or app password
  },
});

/**
 * Send an email using Office 365
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {string} [html] - Email body (HTML format, optional)
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.OFFICE365_EMAIL, // Sender's email address
      to, // Recipient's email address
      subject, // Email subject
      text, // Plain text body
      ...(html && { html }), // HTML body (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { status: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { status: false, message: error.message };
  }
};

module.exports = { sendEmail };
