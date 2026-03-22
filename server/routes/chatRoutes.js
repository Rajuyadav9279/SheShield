const express = require("express");
const router = express.Router();

const { addChats, getChats } = require('../controllers/chatCntrl');
const validateToken = require('../middlewares/validateToken');

// SEND MESSAGE
router.post('/', validateToken, addChats);

// GET CHAT
router.get('/:id/emergency/:emerg', validateToken, getChats);

module.exports = router;