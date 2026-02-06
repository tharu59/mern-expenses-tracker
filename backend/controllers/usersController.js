const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

// !user Registration

const usersController = {
  // !Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);
    const fields = { username, email, password };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        throw new Error(`${key} is required`);
      }
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already Exists");
    }
    // hash the user Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // !create the user and save into db
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  // !Login
  // !Profile
};

module.exports = usersController;
