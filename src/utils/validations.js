const mongoose = require("mongoose");

const validString = (str) => {
  if (!str || str === "") {
    return false;
  }
  return true;
};

const validEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validStringLength = (str, len) => {
  return str.length >= len;
};

const validDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const validId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  validEmail,
  validString,
  validStringLength,
  validDate,
  validId,
};
