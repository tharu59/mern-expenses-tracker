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

// !Filter
transactionRouter.get(
  "/transactions/filter",
  isAuthenticated,
  transactionController.getFilterTransactions,
);

// !update
transactionRouter.put(
  "/transactions/update/:id",
  isAuthenticated,
  transactionController.update,
);

// !Delete
transactionRouter.delete(
  "/transactions/delete/:id",
  isAuthenticated,
  transactionController.delete,
);

module.exports = transactionRouter;
