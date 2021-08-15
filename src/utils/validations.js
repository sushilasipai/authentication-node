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

module.exports = {
  validEmail,
  validString,
  validStringLength,
  validDate,
};
