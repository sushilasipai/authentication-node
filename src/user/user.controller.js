const {
  registrationValidation,
  loginValidation,
} = require("./user.validation");
const UserService = require("./index");
const User = require("./user.model");
const { Crypt } = require("./user.utils");

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
      /*
       * TODO : Send email in future when the user is registered
       */
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
};

module.exports = UserController;
