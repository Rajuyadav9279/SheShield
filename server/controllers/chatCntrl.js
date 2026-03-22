const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');
const { Chat } = require('../models/chatVictimModel');
const { Emergency } = require('../models/emergencyModel');

// SEND MESSAGE
const addChats = asyncHandler(async (req, res) => {

  const { senderId, receiverId, text, emergId } = req.body;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  const emergency = await Emergency.findById(emergId);

  if (!sender || !receiver) {
    return res.status(404).json({ message: "User not found" });
  }

  const newChat = await Chat.create({
    sender: senderId,
    receiver: receiverId,
    textChat: text,
    emergency: emergId
  });

  res.status(201).json(newChat);
});


// GET CHAT
const getChats = asyncHandler(async (req, res) => {

  const receiver = req.params.id;
  const emerg = req.params.emerg;

  const chats = await Chat.find({
    receiver: receiver,
    emergency: emerg
  }).sort({ createdAt: 1 }); // oldest first

  res.status(200).json(chats);
});

module.exports = { addChats, getChats };