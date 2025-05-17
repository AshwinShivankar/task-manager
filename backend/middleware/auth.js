const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production
const redisClient = require("../utils/redisClient");

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    const cachedToken = await redisClient.get(`auth:${verified.id}`);
    if (cachedToken !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateToken };
