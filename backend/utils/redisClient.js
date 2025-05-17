const redis = require("redis");

// Create Redis client
const redisClient = createClient({
  socket: {
    host: "127.0.0.1", // or 'localhost'
    port: 6379,
  },
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.connect(); // Important for Redis v4+

module.exports = redisClient;
