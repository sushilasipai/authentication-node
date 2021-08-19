const sinon = require("sinon");
const articleValidationMsg = require("../article.constraints");
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

  describe("delete article test", () => {
    it("should return invalid id error if article with given id is not found", async () => {
      const ArticleMock = {
        findOneAndDelete: sinon.fake.returns(null),
      };

      let articleService = new ArticleService(ArticleMock);
      try {
        const article = await articleService.deleteArticle("");
      } catch (error) {
        expect(error.type).toBe("ValidationError");
        expect(error.errors[0].message).toBe(articleValidationMsg.ID_NOT_VALID);
      }
      expect(ArticleMock.findOneAndDelete.calledOnce).toBeTruthy();
    });

    it("should delete article if article with id found", async () => {
      const ArticleMock = {
        findOneAndDelete: sinon.fake.returns({ title: "ABC" }),
      };

      let articleService = new ArticleService(ArticleMock);
      const article = await articleService.deleteArticle("111");
      expect(ArticleMock.findOneAndDelete.calledOnce).toBeTruthy();
      expect(article).toBeDefined();
    });
  });

  describe("update article test", () => {
    it("should return null if invalid id is passed", async () => {
      const ArticleMock = {
        updateOne: sinon.fake.returns(null),
        findOne: sinon.fake.returns(null),
      };

      let articleService = new ArticleService(ArticleMock);
      const response = await articleService.updateArticle("", {
        title: "abcd",
      });
      expect(ArticleMock.updateOne.calledOnce).toBeTruthy();
      expect(ArticleMock.findOne.calledOnce).toBeTruthy();
      expect(response).toBe(null);
    });

    it("should return updated article if id is valid", async () => {
      const ArticleMock = {
        updateOne: sinon.spy(),
        findOne: sinon.fake.returns({ title: "Abc" }),
      };
      const fields = { title: "12342" };

      let articleService = new ArticleService(ArticleMock);
      const response = await articleService.updateArticle("123", fields);

      expect(ArticleMock.updateOne.calledOnce).toBeTruthy();
      expect(ArticleMock.findOne.calledOnce).toBeTruthy();
      expect(response).toBeDefined();
    });
  });
});
