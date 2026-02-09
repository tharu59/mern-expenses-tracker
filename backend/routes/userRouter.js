const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuth");

const userRouter = express.Router();

// !Register
userRouter.post("/register", usersController.register);
// ! Login
userRouter.post("/login", usersController.login);
// !Profile
userRouter.post("/profile", isAuthenticated, usersController.profile);
// ! Home
userRouter.get("/tharun", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

module.exports = userRouter;
