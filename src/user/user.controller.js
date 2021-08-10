const { ValidationMessage } = require("./user.constraints");
const User = require("./user.model");

const UserController = {
  register: async (req, res) => {
    const { email, password, firstName, middleName, lastName } = req.body;
    if (!email || email === "") {
      return res.status(400).json({
        message: ValidationMessage.EMAIL_IS_REQUIRED,
        type: "ValidationError",
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: ValidationMessage.EMAIL_NOT_VALID,
        type: "ValidationError",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: ValidationMessage.PASSWORD_IS_REQUIRED,
        type: "ValidationError",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: ValidationMessage.PASSWORD_CHAR_ERROR,
        type: "ValidationError",
      });
    }
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          message: ValidationMessage.EMAIL_ALREADY_EXISTS,
          type: "ValidationError",
        });
      }
      const savedUser = await User.create({
        email,
        password,
        firstName,
        middleName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(200).json({
        message: "User registered Successfully",
        savedUser,
      });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "server error" });
    }
  },
};

module.exports = UserController;
