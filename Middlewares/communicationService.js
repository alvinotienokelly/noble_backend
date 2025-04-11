const nodemailer = require("nodemailer");

// Configure the transporter for cPanel SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send an email using cPanel SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {string} [html] - Email body (HTML format, optional)
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: "noreply@yourdomain.com", // Sender's email address
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