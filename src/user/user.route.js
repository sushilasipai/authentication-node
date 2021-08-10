const express = require("express");
const UserController = require("./user.controller");
const UserRouter = express.Router();

UserRouter.post("/register", UserController.register);

module.exports = UserRouter;
