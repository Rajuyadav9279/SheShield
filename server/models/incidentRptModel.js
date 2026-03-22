const mongoose = require("mongoose");

const IncidentSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  mediaSt: {   // ✅ FIXED NAME
    type: String
  },

  pincodeOfIncident: {
    type: String,
    required: true
  },

  report: {
    type: String,
    required: true
  },

  isSeen: {
    type: Boolean,
    default: false
  },

  address: {
    type: String,
    required: true
  }

}, { timestamps: true });

const Incident = mongoose.model("Incident", IncidentSchema);
module.exports = { Incident };