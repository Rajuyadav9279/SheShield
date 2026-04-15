const express = require('express');
const router = express.Router();

const validateToken = require('../middlewares/validateToken');
const upload = require('../middlewares/upload');

const {
  addIncident,
  getAllIncidents,
  acknowledgeInc
} = require('../controllers/incidentCntrl');

// ✅ CREATE INCIDENT
router.route('/').post(validateToken, upload.single('note'), addIncident);

// ✅ GET ALL INCIDENTS
router.get('/', validateToken, getAllIncidents);

// ✅ ACKNOWLEDGE
router.patch('/:id', validateToken, acknowledgeInc);



module.exports = router;