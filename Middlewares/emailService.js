// Middlewares/emailService.js
// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const transporter = nodemailer.createTransport({
//   service: "gmail", // Use your email service
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address
//     pass: process.env.EMAIL_PASS, // Your email password
//   },
// });

const sendVerificationCode = async (email, code) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // Your verified sender email
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await sgMail.send(msg);
    console.log("Verification code sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendVerificationCode };
