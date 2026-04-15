const asyncHandler = require('express-async-handler');
const { Incident } = require('../models/incidentRptModel');
require('dotenv').config();

// ================= ADD INCIDENT =================
const addIncident = asyncHandler(async (req, res) => {

  console.log("REQ USER:", req.user); // ✅ DEBUG

  const { report, pincodeOfIncident, address } = req.body;

  const user = req.user?.id; // ✅ FROM TOKEN

  if (!user) {
    return res.status(401).json({ message: "User not found in token" });
  }

  const incident = await Incident.create({
    user,
    report,
    pincodeOfIncident,
    address
  });

  res.status(201).json({ message: "Incident reported successfully" });
});

// ================= GET INCIDENTS =================
const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.find()
    .populate("user", "uname email")
    .sort({ createdAt: -1 });

  res.status(200).json(incidents);
});

// ================= ACKNOWLEDGE =================
const acknowledgeInc = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    return res.status(404).json({ message: "Not found" });
  }

  incident.isSeen = true;
  await incident.save();

  res.json({ message: "Marked as seen" });
});

module.exports = { addIncident, getAllIncidents, acknowledgeInc };