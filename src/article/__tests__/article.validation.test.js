const ArticleValidation = require("../article.validation");
const articleValidationMsg = require("../article.constraints");
const faker = require("faker");
const mongoose = require("mongoose");

describe("article validation test", () => {
  it("should be defined", (done) => {
    expect(ArticleValidation).toBeDefined();
    done();
  });

  describe("create article test", () => {
    it("should not return error if correct article data is passed", (done) => {
      const article = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };

      const { errors } = ArticleValidation.createArticle(article);
      expect(errors.length).toBe(0);
      done();
    });

    it("should return appropriate error messages", (done) => {
      const article = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        publishDate: new Date(),
      };
      const errorMessages = {
        title: articleValidationMsg.TITLE_REQUIRED,
        shortDescription: articleValidationMsg.SHORT_DESC_REQUIRED,
        body: articleValidationMsg.BODY_REQUIRED,
        publishDate: articleValidationMsg.PUBLISHED_DATE_REQUIRED,
        notValidDate: articleValidationMsg.NOT_VALID_DATE,
      };
      //Required test Cases
      const testCases = [
        "title",
        "shortDescription",
        "body",
        "publishDate",
        "all",
      ];
      testCases.forEach((testCase) => {
        let testArticle = {};
        if (testCase === "all") {
          const { errors } = ArticleValidation.createArticle(testArticle);
          expect(errors.length).toBe(5);
          return;
        }
        testArticle = article;
        testArticle = { ...testArticle, [testCase]: "" };
        const { errors } = ArticleValidation.createArticle(testArticle);
        if (testCase === "publishDate") {
          expect(errors.length).toBe(2);
          expect(errors[0].message).toBe(errorMessages.publishDate);
          expect(errors[1].message).toBe(errorMessages.notValidDate);
          return;
        }
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(errorMessages[testCase]);
        return;
      });
      done();
    });
  });

  describe("validate id", () => {
    it("should return invalid id error if id is not passed", (done) => {
      const { errors } = ArticleValidation.validateId("");
      expect(errors.length).toBe(2);
      expect(errors[0].message).toBe(articleValidationMsg.ID_NOT_VALID);
      expect(errors[1].message).toBe(articleValidationMsg.ID_NOT_VALID);
      done();
    });

    it("should return invalid id error if invalid id is passed", (done) => {
      const { errors } = ArticleValidation.validateId("dsfdfs");
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(articleValidationMsg.ID_NOT_VALID);
      done();
    });

    it("should return invalid id error if invalid id is passed", (done) => {
      const id = mongoose.Types.ObjectId();
      const { errors } = ArticleValidation.validateId(id);
      expect(errors.length).toBe(0);
      done();
    });
  });
});
