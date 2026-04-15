const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    profile: {
      type: String,
    },

    // ❌ removed unique
    phoneNo: {
      type: String,
    },

    password: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    city: {
      type: String,
    },

    // ✅ changed to String
    emergencyNo: {
      type: String,
    },

    emergencyMail: {
      type: String,
    },

    // ✅ changed to String
    pinCode: {
      type: String,
    },

    address: {
      type: String,
    },

    role: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    extraPhone1: {
      type: String
    },
    extraPhone2: {
      type: String
    },
    extraEmail1: {
      type: String
    },
    extraEmail2: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { User };