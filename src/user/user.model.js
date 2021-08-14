const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ValidationMessage } = require("./user.constraints");
const { validEmail, validStringLength } = require("../utils/validations");
const UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    required: ValidationMessage.EMAIL_REQUIRED,
    validate: {
      validator: (email) => {
        return validEmail(email);
      },
      message: ValidationMessage.EMAIL_NOT_VALID,
    },
  },
  password: {
    type: String,
    required: ValidationMessage.PASSWORD_REQUIRED,
    validate: {
      validator: (password) => {
        return validStringLength(password, 8);
      },
      message: ValidationMessage.PASSWORD_CHAR_ERROR,
    },
  },
  firstName: {
    type: String,
    required: false,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  lastLogin: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
