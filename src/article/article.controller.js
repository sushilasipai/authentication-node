const ArticleValidation = require("./article.validation");
const ArticleService = require("./index");

const ArticleController = {
  createArticle: async (req, res) => {
    let { title, shortDescription, body, publishDate } = req.body;
    publishDate = new Date(publishDate) ?? new Date();
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
};

module.exports = ArticleController;
