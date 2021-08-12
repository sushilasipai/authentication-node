const User = require("./user.model");
const UserService = require("./user.service");
const { Crypt } = require("./user.utils");

module.exports = new UserService(User, Crypt);
