const uuid = require("uuid");

const generateUuidToken = () => {
  return uuid.v4();
};

module.exports = { generateUuidToken };
