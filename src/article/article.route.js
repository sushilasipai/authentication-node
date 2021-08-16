const articleRouter = require("express").Router();
const ArticleController = require("./article.controller");
const { AuthMiddleware } = require("../middlewares");

articleRouter.post(
  "/create",
  AuthMiddleware.checkAuth,
  ArticleController.createArticle
);

articleRouter.get("/", ArticleController.getAllArticles);

module.exports = articleRouter;
