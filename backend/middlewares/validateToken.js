const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader); // ✅ DEBUG

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("DECODED:", decoded); // ✅ DEBUG

    req.user = decoded.user;

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message); // ✅ DEBUG
    return res.status(401).json({ message: "User not authenticated" });
  }
});

module.exports = validateToken;