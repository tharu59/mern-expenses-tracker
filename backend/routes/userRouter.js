const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuth");

const userRouter = express.Router();

// !Register
userRouter.post("/register", usersController.register);
// ! Login
userRouter.post("/login", usersController.login);
// !Profile
// userRouter.post("/profile", isAuthenticated, usersController.profile);
userRouter.get("/profile", isAuthenticated, usersController.profile);
// !Change Password
userRouter.put(
  "/change-password",
  isAuthenticated,
  usersController.changeUserPassword,
);
// !Update profile
userRouter.put(
  "/update-profile",
  isAuthenticated,
  usersController.updateUserProfile,
);

// ?OWN
// ! Home
userRouter.get("/tharun", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

module.exports = userRouter;
