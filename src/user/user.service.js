const { ValidationMessage } = require("./user.constraints");

class UserService {
  constructor(UserModel, Crypt) {
    this.UserModel = UserModel;
    this.Crypt = Crypt;
  }

  async createUser({ ...data }) {
    const { email, password, firstName, middleName, lastName } = data;
    try {
      const user = await this.UserModel.findOne({ email });
      if (user) {
        let error = new Error(ValidationMessage.EMAIL_ALREADY_EXISTS);
        error.type = "ValidationError";
        throw error;
      }

      const hashedPassword = await this.Crypt.hashPassword(password);

      const savedUser = await this.UserModel.create({
        email,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        let error = new Error();
        error.type = "AuthorizationError";
        throw error;
      }

      const loginSuccess = await this.Crypt.comparePassword(
        user.password,
        password
      );

      if (!loginSuccess) {
        let error = new Error();
        error.type = "AuthorizationError";
        throw error;
      }

      return {
        email: user.email,
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
