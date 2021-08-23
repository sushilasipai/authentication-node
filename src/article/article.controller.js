const articleValidationMsg = require("./article.constraints");
const ArticleValidation = require("./article.validation");
const ArticleService = require("./index");

const ArticleController = {
  createArticle: async (req, res) => {
    let { title, shortDescription, body, publishDate } = req.body;
   
    publishDate = publishDate ? new Date(publishDate): new Date();
     console.log(publishDate);
    const author = req.user._id;

    const { errors } = ArticleValidation.createArticle({
      title,
      shortDescription,
      body,
      publishDate,
    });

    if (errors.length > 0) {
      return res.status(400).json({ type: "ValidationError", errors });
    }

    try {
      const createdArticle = await ArticleService.createArticle({
        title,
        shortDescription,
        body,
        author,
        publishDate,
      });
      return res.status(200).json({
        message: "Article created successfully.",
        article: createdArticle,
      });
    } catch (error) {
      return res.status(400).json({ message: "server error" });
    }
  },

  getAllArticles: async (req, res) => {
    try {
      const articles = await ArticleService.getAllArticles();

      return res.status(200).json({ articles });
    } catch (error) {
      return res.status(400).json({ message: "server error" });
    }
  },

  getArticleById: async (req, res) => {
    const { id } = req.params;
    const { errors } = await ArticleValidation.validateId(id);

    if (errors.length > 0) {
      return res.status(400).json({ type: "ValidationError", errors });
    }
    try {
      const article = await ArticleService.getArticleById(id);
      return res.status(200).json({ article });
    } catch (error) {
      return res.status(400).json({ message: "server error" });
    }
  },

  deleteArticle: async (req, res) => {
    const { id } = req.params;
    const { errors } = await ArticleValidation.validateId(id);

    if (errors.length > 0) {
      return res.status(400).json({ type: "ValidationError", errors });
    }
    try {
      const article = await ArticleService.deleteArticle(id);
      return res
        .status(200)
        .json({ message: "Article deleted successfully.", article });
    } catch (error) {
      if (error.type === "ValidationError") {
        return res.status(400).json(error);
      }
      return res.status(400).json({ message: "server error" });
    }
  },

  updateArticle: async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const { errors } = await ArticleValidation.updateArticle(id, fields);

    if (errors.length > 0) {
      return res.status(400).json({
        type: "ValidationError",
        errors,
      });
    }

    try {
      const updatedArticle = await ArticleService.updateArticle(id, {
        ...fields,
      });

      return res
        .status(200)
        .json({ message: "Article successfully update", updatedArticle });
    } catch (error) {
      return res.status(400).json({ message: "error while updating article" });
    }
  },
};

module.exports = ArticleController;
