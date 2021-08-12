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

module.exports = {
  validEmail,
  validString,
  validStringLength,
};
