const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const { Emergency } = require("../models/emergencyModel");
const { sendHelpEmail, sendHelpEmailContacts } = require("../utils/email");
const axios = require("axios");

// Reverse Geocoding Function
const getAddress = async (lat, long) => {
  try {
    const { data } = await axios.get(
      `https://apis.mapmyindia.com/advancedmaps/v1/${process.env.MAP_API}/rev_geocode?lat=${lat}&lng=${long}`
    );

    if (data && data.results && data.results.length > 0) {
      return {
        pincode: data.results[0].pincode,
        formatted_address: data.results[0].formatted_address,
      };
    } else {
      return {
        pincode: "Unknown",
        formatted_address: "Location not found",
      };
    }
  } catch (err) {
    console.log("Map API Error:", err.message);
    return {
      pincode: "Unknown",
      formatted_address: "Location not found",
    };
  }
};

// Send Emergency
const sendemergencyCntrl = asyncHandler(async (req, res) => {
  const { userId, lat, long } = req.body;

  if (!userId || !lat || !long) {
    return res.status(400).json({ message: "UserId, Latitude or Longitude missing" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Get Address from coordinates
  const locationData = await getAddress(lat, long);
  const pincode = locationData.pincode;
  const formattedAddress = locationData.formatted_address;

  // Trusted Contacts Emails
  const recipients = [];
  if (user.emergencyMail) recipients.push(user.emergencyMail);
  if (user.extraEmail1) recipients.push(user.extraEmail1);
  if (user.extraEmail2) recipients.push(user.extraEmail2);

  // Send email to trusted contacts
  if (recipients.length > 0) {
    await sendHelpEmail(recipients, lat, long, user.uname, pincode, formattedAddress);
  }

  // Send email to nearby users
  const nearbyUsers = await User.find({ pinCode: pincode });
  const nearbyEmails = nearbyUsers.map((u) => u.email);

  if (nearbyEmails.length > 0) {
    await sendHelpEmailContacts(
      nearbyEmails,
      lat,
      long,
      user.uname,
      pincode,
      formattedAddress
    );
  }

  // Save Emergency in DB
  const emergency = await Emergency.create({
    user: userId,
    emergencyLctOnMap: `https://maps.google.com/maps?q=${lat},${long}`,
    addressOfIncd: formattedAddress,
    pincode: pincode,
    isResolved: false,
  });

  res.status(200).json({
    message: "SOS sent successfully",
    emergencyId: emergency._id,
  });
});

// Get All Emergencies (Admin)
const getAllEmergencies = asyncHandler(async (req, res) => {
  const emergencies = await Emergency.find({})
    .populate("user", "uname emergencyNo email")
    .sort({ createdAt: -1 });

  const data = emergencies.map((e) => ({
    _id: e._id,
    userId: e.user?._id,
    username: e.user?.uname,
    emergencyNo: e.user?.emergencyNo,
    email: e.user?.email,
    mapLct: e.emergencyLctOnMap,
    addressOfInc: e.addressOfIncd,
    pincode: e.pincode,
    isResolved: e.isResolved,
    createdAt: e.createdAt,
  }));

  res.status(200).json(data);
});

// Get Single Emergency
const getSinglEmergency = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id).populate(
    "user",
    "uname emergencyNo email"
  );

  if (!emergency) {
    return res.status(404).json({ message: "Emergency not found" });
  }

  res.status(200).json({
    _id: emergency._id,
    username: emergency.user?.uname,
    emergencyNo: emergency.user?.emergencyNo,
    email: emergency.user?.email,
    mapLct: emergency.emergencyLctOnMap,
    addressOfInc: emergency.addressOfIncd,
    pincode: emergency.pincode,
    isResolved: emergency.isResolved,
    createdAt: emergency.createdAt,
  });
});

// Mark Emergency as Resolved
const emergencyUpdate = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return res.status(404).json({ message: "Emergency not found" });
  }

  emergency.isResolved = true;
  await emergency.save();

  res.status(200).json({ message: "Emergency marked as resolved" });
});

module.exports = {
  sendemergencyCntrl,
  getAllEmergencies,
  getSinglEmergency,
  emergencyUpdate,
};