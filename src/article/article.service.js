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
}

module.exports = ArticleService;
