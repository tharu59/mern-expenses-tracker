const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  login: asyncHandler(async (req, res) => {
    // ?Get the user Data
    const { email, password } = req.body;
    // ! check is email valid or not
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found Please register");
    }
    // !compare the user password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Please enter correct password");
    }
    // !generate Token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }, // 👈 2 hours
    );

    // 🍪 SET COOKIE HERE
    res.cookie("token", token, {
      httpOnly: true, // JS cannot access
      secure: false, // true in production (HTTPS)
      sameSite: "lax", // good default
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    //! send the response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  // !Profile
};

module.exports = usersController;
