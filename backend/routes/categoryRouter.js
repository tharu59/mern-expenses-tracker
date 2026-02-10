const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const categoryController = require("../controllers/categoryController");

const categoryRouter = express.Router();

// !add
categoryRouter.post(
  "/categories/create",
  isAuthenticated,
  categoryController.create,
);

// !lists
categoryRouter.get(
  "/categories/lists",
  isAuthenticated,
  categoryController.lists,
);

module.exports = categoryRouter;
