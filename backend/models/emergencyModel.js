const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emergencyLctOnMap: {
      type: String,
      required: true,
    },
    addressOfIncd: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Emergency = mongoose.model("Emergency", EmergencySchema);
module.exports = { Emergency };