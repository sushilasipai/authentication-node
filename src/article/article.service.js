const ValidationMessage = require("./article.constraints");

class ArticleService {
  constructor(Article) {
    this.Article = Article;
  }

  async createArticle(article) {
    try {
      let createdArticle = await this.Article.create({ ...article });
      return createdArticle;
    } catch (error) {
      throw error;
    }
  }

  async getAllArticles() {
    try {
      let articles = await this.Article.find({});
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async getArticleById(id) {
    try {
      let article = await this.Article.findOne({ _id: id });
      return article;
    } catch (error) {
      throw error;
    }
  }

  async deleteArticle(id) {
    try {
      let article = await this.Article.findOneAndDelete({ _id: id });
      if (!article) {
        let error = new Error();
        error.type = "ValidationError";
        error.errors = [{ message: ValidationMessage.ID_NOT_VALID }];
        throw error;
      }
      return article;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
