const express = require("express");
const UserController = require("./user.controller");
const UserRouter = express.Router();

UserRouter.post("/register", UserController.register);

UserRouter.post("/login", UserController.login);

UserRouter.post("/forgotpassword", UserController.forgotPassword);

UserRouter.post("/resetpassword", UserController.resetPassword);

module.exports = UserRouter;
