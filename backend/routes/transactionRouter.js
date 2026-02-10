const express = require("express");
const transactionController = require("../controllers/transactionController");
const isAuthenticated = require("../middlewares/isAuth");

const transactionRouter = express.Router();

// !add
transactionRouter.post(
  "/transactions/create",
  isAuthenticated,
  transactionController.create,
);

// !lists
transactionRouter.get(
  "/transactions/lists",
  isAuthenticated,
  transactionController.lists,
);

module.exports = transactionRouter;
