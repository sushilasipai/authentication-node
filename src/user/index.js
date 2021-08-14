const User = require("./user.model");
const UserService = require("./user.service");
const { Crypt } = require("./user.utils");
const TokenGenerator = require("../utils/token");

module.exports = new UserService(User, Crypt, TokenGenerator);
