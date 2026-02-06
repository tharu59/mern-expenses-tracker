const express = require("express");
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", usersController.register);
userRouter.post("/login", usersController.login);

userRouter.get("/tharun", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = userRouter;
