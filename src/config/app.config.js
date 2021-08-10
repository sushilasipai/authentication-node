const express = require("express");
const router = require("../routes");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api", router);

module.exports = app;
