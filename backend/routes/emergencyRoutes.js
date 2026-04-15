const express = require("express");
const router = express.Router();

// SOS Route
router.post("/emergencyPressed", async (req, res) => {
  try {
    const { userId, lat, long } = req.body;

    console.log("SOS Received:");
    console.log("User:", userId);
    console.log("Latitude:", lat);
    console.log("Longitude:", long);

    res.status(200).json({
      success: true,
      message: "Emergency sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
