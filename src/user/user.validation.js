const {
  validString,
  validEmail,
  validStringLength,
} = require("../utils/validations");

const { ValidationMessage } = require("./user.constraints");

const registrationValidation = ({ email, password }) => {
  let errors = [];
  if (!validString(email)) {
    const error = {
      message: ValidationMessage.EMAIL_REQUIRED,
    };
    /*This is equal to
     *errors.push(error)
     */
    errors = [...errors, error];
  }
  if (!validEmail(email)) {
    const error = {
      message: ValidationMessage.EMAIL_NOT_VALID,
    };
    errors = [...errors, error];
  }
  if (!validString(password)) {
    const error = {
      message: ValidationMessage.PASSWORD_REQUIRED,
    };
    errors = [...errors, error];
  }

  if (!validStringLength(password, 8)) {
    const error = {
      message: ValidationMessage.PASSWORD_CHAR_ERROR,
    };
    errors = [...errors, error];
  }
  return {
    errors,
  };
};

const forgotPasswordValidation = (email) => {
  let errors = [];

  if (!validEmail(email)) {
    const error = {
      message: ValidationMessage.EMAIL_NOT_VALID,
    };

    errors = [...errors, error];
  }

  return { errors };
};

module.exports = {
  registrationValidation,
  loginValidation: registrationValidation,
  forgotPasswordValidation,
};
