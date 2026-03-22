const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  textChat: {
    type: String,
    required: [true, "message is required"]
  },

  emergency: {
    type: mongoose.Types.ObjectId,
    ref: "Emergency"
  }

}, { timestamps: true }); // ✅ IMPORTANT

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = { Chat };