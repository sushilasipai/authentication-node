const bcrypt = require("bcrypt");
const saltRounds = 5;

const Crypt = {
  hashPassword: async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },

  comparePassword: async (hashPassword, password) => {
    return await bcrypt.compare(password, hashPassword);
  },
};

module.exports = { Crypt };
