import { createClient } from "redis";
import { redisHost, redisPassword } from "./redisPassword";

// Create Redis client
const redisClient = createClient({
  username: "default",
  password: redisPassword,
  socket: {
    host: redisHost,
    port: 10149,
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
let isConnected = false;

// Async function to connect Redis
async function connectRedis() {
  if (isConnected) return;
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

export default redisClient;
