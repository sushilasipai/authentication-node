const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const envVars = require("../config/envVars.config");

const generateUuidToken = () => {
  return uuid.v4();
};

const generateJwtToken = (id, expiresIn = "1d") => {
  const token = jwt.sign({ id }, envVars.jwt_private_key, { expiresIn });
  return token;
};

const checkJwtToken = (token) => {
  const decoded = jwt.verify(token, envVars.jwt_private_key);
  return decoded;
};

const backDateToken = (id, timeinseconds) => {
  return jwt.sign(
    { id, exp: Math.floor(Date.now() / 1000) - timeinseconds },
    envVars.jwt_private_key
  );
};
module.exports = {
  generateUuidToken,
  generateJwtToken,
  checkJwtToken,
  backDateToken,
};
