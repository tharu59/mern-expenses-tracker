const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

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
    const transactions = await Transaction.find({
      user: req.user,
    });
    res.json(transactions);
  }),

  // ! Update
  update: asyncHandler(async (req, res) => {}),

  // ! Delete
  delete: asyncHandler(async (req, res) => {}),
};

module.exports = transactionController;
