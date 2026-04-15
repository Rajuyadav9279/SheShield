const asyncHandler = require("express-async-handler");
const { Location } = require("../models/locationModel");
const { User } = require("../models/userModel");

// Update or Create Live Location
const updateLocation = asyncHandler(async (req, res) => {
  const { userId, lat, long } = req.body;

  if (!userId || lat === undefined || long === undefined) {
    return res.status(400).json({ message: "userId, lat, and long are required" });
  }

  // Upsert the location for the user
  const location = await Location.findOneAndUpdate(
    { user: userId },
    { lat, long, user: userId },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    message: "Location updated successfully",
    location,
  });
});

// Get User's Current Live Location
const getLocation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const location = await Location.findOne({ user: userId }).populate("user", "uname emergencyNo email");

  if (!location) {
    return res.status(404).json({ message: "Location not found for this user." });
  }

  res.status(200).json({
    success: true,
    location,
  });
});

module.exports = {
  updateLocation,
  getLocation,
};
