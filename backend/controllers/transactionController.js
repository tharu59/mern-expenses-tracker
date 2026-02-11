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

  // !Filter
  getFilterTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    // console.log(req.query);
    // let filters = { user: req.user.id };
    let filters = {};
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
      } else if (category === "Uncategorised") {
        filters.category = "Uncategorised";
      } else {
        filters.category = category;
      }
    }
    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: transactions,
    });
  }),

  // ! Update
  update: asyncHandler(async (req, res) => {
    //! Find the transaction
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user.toString()) {
      ((transaction.type = req.body.type || transaction.type),
        (transaction.category = req.body.category || transaction.category),
        (transaction.amount = req.body.amount || transaction.amount),
        (transaction.date = req.body.date || transaction.date),
        (transaction.description =
          req.body.description || transaction.description));
      //update
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    }
  }),

  // ! Delete
  delete: asyncHandler(async (req, res) => {
    //! Find the transaction
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    }
  }),
};

module.exports = transactionController;
