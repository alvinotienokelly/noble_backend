const nodemailer = require("nodemailer");

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: userEmail,
    pass: userPassword,
  },
  tls: {
    rejectUnauthorized: false,
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
      from: userEmail,
      to: to,
      subject: subject,
      text: text,
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
