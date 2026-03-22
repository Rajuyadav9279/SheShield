const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const {
  gmailContent,
  successFullVerification,
  mapLocation,
  mapLocationNearby,
} = require("./emailTemplate");

const secret_key = process.env.ACCESS_TOKEN_SECRET;

// Generate Email Verification Token
const generateverificationToken = (email) => {
  return jwt.sign({ email: email }, secret_key, { expiresIn: "1d" });
};

// Reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Send Verification Email
const sendVerificationEmail = async (recipientEmail, verificationToken) => {
  try {
    const emailcontent = gmailContent(verificationToken);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: "Email Verification - SheShield",
      html: emailcontent,
    });

    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Send Emergency Email to Trusted Contacts
const sendHelpEmail = async (
  recipientEmail,
  lat,
  long,
  username,
  pincode,
  formatted_address
) => {
  try {
    const emailcontent = mapLocation(
      lat,
      long,
      username,
      pincode,
      formatted_address
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: `🚨 ${username} NEEDS HELP!!!`,
      html: emailcontent,
    });

    console.log("Emergency email sent to contacts");
  } catch (error) {
    console.error("Error sending emergency email:", error);
  }
};

// Send Emergency Email to Nearby Users
const sendHelpEmailContacts = async (
  recipientEmail,
  lat,
  long,
  username,
  pincode,
  formatted_address
) => {
  try {
    const emailcontent = mapLocationNearby(
      lat,
      long,
      username,
      pincode,
      formatted_address
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: `🚨 Nearby Emergency Alert`,
      html: emailcontent,
    });

    console.log("Emergency email sent to nearby users");
  } catch (error) {
    console.error("Error sending nearby email:", error);
  }
};

module.exports = {
  generateverificationToken,
  sendVerificationEmail,
  sendHelpEmailContacts,
  sendHelpEmail,
};