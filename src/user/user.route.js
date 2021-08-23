const express = require("express");
const UserController = require("./user.controller");
const UserRouter = express.Router();
const { AuthMiddleware } = require("../middlewares");

UserRouter.get("/me", AuthMiddleware.checkAuth, UserController.me);

UserRouter.get("/", AuthMiddleware.checkAuth, UserController.getAllUsers);

UserRouter.post("/register", UserController.register);

UserRouter.post("/login", UserController.login);

UserRouter.post("/forgotpassword", UserController.forgotPassword);

UserRouter.post("/resetpassword", UserController.resetPassword);

module.exports = UserRouter;
