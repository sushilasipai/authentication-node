const sinon = require("sinon");
const ArticleService = require("../article.service");

describe("article service test", () => {
  it("should be deifined", (done) => {
    expect(ArticleService).toBeDefined();
    done();
  });

  describe("create article test", () => {
    it("should create article ", async () => {
      const ArticleMock = {
        create: sinon.spy(),
      };
      const article = {};

      let articleService = new ArticleService(ArticleMock);
      await articleService.createArticle(article);

      expect(ArticleMock.create.calledOnce).toBeTruthy();
    });
  });

  describe("get all articles test", () => {
    it("should return null array if no data is found", async () => {
      const ArticleMock = {
        find: sinon.fake.returns(null),
      };

      let articleService = new ArticleService(ArticleMock);
      const articles = await articleService.getAllArticles();

      expect(ArticleMock.find.calledOnce).toBeTruthy();
      expect(articles).toBeDefined();
    });

    it("should return all datas found", async () => {
      const ArticleMock = {
        find: sinon.fake.returns(true),
      };

      let articleService = new ArticleService(ArticleMock);
      const articles = await articleService.getAllArticles();

      expect(ArticleMock.find.calledOnce).toBeTruthy();
      expect(articles).toBeDefined();
    });
  });

  describe("get article by id test", () => {
    it("should return null if article with the id is not found", async () => {
      const ArticleMock = {
        findOne: sinon.fake.returns(null),
      };

      let articleService = new ArticleService(ArticleMock);
      const article = await articleService.getArticleById("dsfsdfa");
      expect(ArticleMock.findOne.calledOnce).toBeTruthy();
      expect(article).toBe(null);
    });
    it("should return data if article with the id is  found", async () => {
      const ArticleMock = {
        findOne: sinon.fake.returns({ title: "Abc" }),
      };

      let articleService = new ArticleService(ArticleMock);
      const article = await articleService.getArticleById("123");
      expect(ArticleMock.findOne.calledOnce).toBeTruthy();
    });
  });
});
