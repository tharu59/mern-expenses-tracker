const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");
const redisClient = require("../Configs/redisConfig");
const connectDB = require("../Configs/mongoConfig");

const transactionController = {
  // !add
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!type || !amount) {
      throw new Error("Type, amount and date are required");
    }
    // ! Create
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
      date,
    });
    res.status(201).json(transaction);
  }),
  // ! Lists
  lists: asyncHandler(async (req, res) => {
    const userId = req.user;
    const redisKey = `transactions:${userId}`;
    // 🔍 1️⃣ Check Redis
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log("Serving from Redis ⚡");
      return res.json({
        source: "redis",
        transactions: JSON.parse(cachedData),
      });
    }
    // 🟢 2️⃣ If not found, fetch from MongoDB
    await connectDB();

    const transactions = await Transaction.find({
      user: userId,
    });
    // 💾 3️⃣ Store in Redis for 60 seconds
    await redisClient.setEx(redisKey, 60, JSON.stringify(transactions));
    console.log("Serving from MongoDB 🟢");
    res.json({ source: "mongodb", transactions });
  }),

  // ! Update
  update: asyncHandler(async (req, res) => {}),

  // ! Delete
  delete: asyncHandler(async (req, res) => {}),
};

module.exports = transactionController;
