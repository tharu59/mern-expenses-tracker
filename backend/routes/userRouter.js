const express = require("express");
const usersController = require("../controllers/usersController");

const userRouter = express.Router();

userRouter.post("/register", usersController.register);

module.exports = userRouter;
