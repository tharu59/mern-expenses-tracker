// import { createClient } from "redis";
const { createClient } = require("redis");

// Create Redis client
const redisClient = createClient({
  username: "default",
  password: process.env.redisPassword,
  socket: {
    host: process.env.redisHost,
    port: process.env.redisPort,
  },
});

// 🔴 Handle errors
redisClient.on("error", (err) => console.error("💥 Redis Client Error:", err));

// ⏳ Connecting
redisClient.on("connect", () => console.log("🔄 Connecting to Redis..."));

// ✅ Connected
redisClient.on("ready", () => console.log("🟢 Redis connected successfully"));

// 🔴 Disconnected
redisClient.on("end", () => console.error("🔴 Redis disconnected"));

// Keep track of connection status
// let isConnected = false;

// Async function to connect Redis
async function connectRedis() {
  // if (isConnected) return;
  if (redisClient.isOpen) {
    console.log("⚡ Redis already connected");
    return;
  }
  try {
    await redisClient.connect();
    isConnected = true;
  } catch (err) {
    console.error("💥 Failed to connect to Redis:", err);
  }
}

// Connect Redis immediately
connectRedis();

// Graceful shutdown on app exit
process.on("SIGINT", async () => {
  if (isConnected) {
    await redisClient.quit();
    console.log("🛑 Redis connection closed");
  }
  process.exit(0);
});

module.exports = redisClient;
