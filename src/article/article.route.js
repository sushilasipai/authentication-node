const articleRouter = require("express").Router();
const ArticleController = require("./article.controller");
const { AuthMiddleware } = require("../middlewares");
const ArticleAcl = require("./article.acl");
articleRouter.post(
  "/create",
  AuthMiddleware.checkAuth,
  ArticleController.createArticle
);

articleRouter.get("/", ArticleController.getAllArticles);

articleRouter.get("/:id", ArticleController.getArticleById);

articleRouter.delete(
  "/:id",
  AuthMiddleware.checkAuth,
  ArticleAcl.deleteAcl,
  ArticleController.deleteArticle
);

articleRouter.post(
  "/update/:id",
  AuthMiddleware.checkAuth,
  ArticleAcl.editAcl,
  ArticleController.updateArticle
);

module.exports = articleRouter;
