const express = require("express");
const { updateLocation, getLocation } = require("../controllers/locationCntrl");

const router = express.Router();

// Live Location Routes
router.post("/update", updateLocation);
router.get("/:userId", getLocation);

module.exports = router;
