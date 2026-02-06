require("dotenv").config({ quiet: true });
const express = require("express");
const userRouter = require("./routes/userRouter");
const connectDB = require("./Configs/mongoConfig");
const app = express();

// !connecting mongodb
connectDB();

// !Middleware
app.use(express.json()); //?Passing incoming json Data

//! Routes
app.use("/", userRouter);

const port = process.env.PORT || 8000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("The server is  running perfectly");
});
