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
});
