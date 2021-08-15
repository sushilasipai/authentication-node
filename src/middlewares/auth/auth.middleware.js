const TokenGenerator = require("../../utils/token");
const User = require("../../user/user.model");

const AuthMiddleware = {
  checkAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = TokenGenerator.checkJwtToken(token);
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({
          type: "AuthenticationError",
          message: "Something went wrong!!",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ type: "AuthenticationError", message: "Token Expired" });
      }
      return res.status(401).json({
        type: "AuthenticationError",
        message: "Something went wrong!!",
      });
    }
  },
};

module.exports = AuthMiddleware;
