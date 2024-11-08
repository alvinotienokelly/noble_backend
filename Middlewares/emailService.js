// Middlewares/emailService.js
// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTaskReminder = async (email, task) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // Your verified sender email
    subject: `Reminder: Task "${task.title}" is due soon`,
    text: `Hello,\n\nThis is a reminder that the task "${task.title}" is due on ${task.due_date}.\n\nDescription: ${task.description}\n\nPlease make sure to complete it on time.\n\nBest regards,\nYour Team`,
  };

  try {
    await sgMail.send(msg);
    console.log("Task reminder sent to:", email);
  } catch (error) {
    console.error("Error sending task reminder:", error);
  }
};

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

module.exports = { sendVerificationCode, sendTaskReminder };
