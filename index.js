const express = require("express");
const app = express();
const UserRoute = require("./routes/user");
const createError = require("http-errors");
require("dotenv").config();
// require("./helpers/connection_redis");
const client = require("./helpers/connection_redis");
const connectDB = require("./helpers/connectDB");
const PORT = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res, next) => {
  res.send("Home Page");
});
app.use("/user", UserRoute);
app.use((req, res, next) => {
  // const error = new Error("Not Found");
  // error.status = 500;
  // next(error);
  next(createError.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
