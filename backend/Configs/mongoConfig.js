// import mongoose from "mongoose";
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB Already Connected");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🟢 MongoDB Connected Successfully");
  } catch (error) {
    console.error("💥 MongoDB Connection Failed:", error);
    process.exit(1); // Stop app if DB connection fails
  }
};

/* 🔴 Disconnected event */
mongoose.connection.on("disconnected", () => {
  console.error("🔴 MongoDB Disconnected");
});

/* 💥 Error event */
mongoose.connection.on("error", (err) => {
  console.error("💥 MongoDB Error:", err);
});

/* 🛑 Graceful shutdown */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB Connection Closed");
  process.exit(0);
});

// export default connectDB;
module.exports = connectDB;
