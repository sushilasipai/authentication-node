const express = require("express");
const router = require("../routes");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api", router);

app.use((req, res, next) => {
  let error = new Error("route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(error.status || 500).json({
    message: error.message || "server error",
  });
});

module.exports = app;
