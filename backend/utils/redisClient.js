const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Default Redis port
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.connect(); // Important for Redis v4+

module.exports = redisClient;
