const {
  registrationValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidaton,
} = require("./user.validation");
const UserService = require("./index");
const User = require("./user.model");
const { Crypt } = require("./user.utils");
const { validEmail } = require("../utils/validations");
const { ValidationMessage } = require("./user.constraints");
const uuid = require("uuid");
const Mailer = require("../utils/mailer");

const UserController = {
  register: async (req, res) => {
    const { email, password, firstName, middleName, lastName } = req.body;
    const { errors } = registrationValidation({ email, password });
    if (errors.length > 0) {
      return res.status(400).json({
        type: "ValidationError",
        errors,
      });
    }
    try {
      const savedUser = await UserService.createUser({ ...req.body });
      const emailPackage = {
        toEmail: savedUser.email,
        subject: "User created successfully",
        body: `Dear ${savedUser.firstName}, Thank you for joining our platform`,
      };

      Mailer.sendEmail(emailPackage);

      return res.status(200).json({
        message: "User registered Successfully",
        savedUser,
      });
    } catch (error) {
      if (error.type === "ValidationError") {
        return res.status(400).json({
          type: "ValidationError",
          message: error.message,
        });
      }
      return res.status(500).json({ message: "server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const { errors } = loginValidation({ email, password });
    if (errors.length > 0) {
      return res.status(400).json({ type: "ValidationError", errors });
    }
    try {
      const user = await UserService.loginUser({ email, password });
      return res.status(200).json({ ...user });
    } catch (error) {
      if (error.type === "AuthorizationError") {
        return res.status(401).json({ type: "AuthorizationError" });
      }
      return res.status(500).json({ message: "server error" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const { errors } = forgotPasswordValidation(email);

    if (errors.length > 0) {
      return res.status(400).json({
        type: "ValidationError",
        errors,
      });
    }

    try {
      const user = await UserService.forgotPassword(email);
      const emailPackage = {
        toEmail: user.email,
        subject: "Password change token",
        body: `Dear ${user.firstName}, Please use token ${user.passwordResetToken} to change your password.`,
      };

      Mailer.sendEmail(emailPackage);

      return res
        .status(200)
        .json({ message: "", token: user.passwordResetToken });
    } catch (error) {
      if (error.type === "ValidationError") {
        return res
          .status(400)
          .json({ type: "ValidationError", errors: error.errors });
      }
      return res.status(500).json({ message: "server error" });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    const { errors } = resetPasswordValidaton({
      newPassword,
      confirmPassword,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        type: "ValidationError",
        errors,
      });
    }

    try {
      const user = await UserService.resetPassword({ token, newPassword });

      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } catch (error) {
      if (error.type === "ValidationError") {
        return res
          .status(400)
          .json({ type: "ValidationError", errors: error.errors });
      }
      return res.status(500).json({ message: "server error" });
    }
  },
};

module.exports = UserController;
