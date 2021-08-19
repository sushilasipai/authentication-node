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

  describe("update article test", () => {
    it("should return invalid article id if invalid id is passed", (done) => {
      const fields = {
        title: articleValidationMsg.TITLE_REQUIRED,
        shortDescription: articleValidationMsg.SHORT_DESC_REQUIRED,
      };
      const { errors } = ArticleValidation.updateArticle("dsfsdf", fields);
      expect(errors.length).toBe(1);

      expect(errors[0]).toHaveProperty(
        "message",
        articleValidationMsg.ID_NOT_VALID
      );
      done();
    });

    it("should throw error message if empty value is passed", (done) => {
      const id = mongoose.Types.ObjectId();
      const fields = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };

      const errorMessages = {
        title: articleValidationMsg.TITLE_REQUIRED,
        shortDescription: articleValidationMsg.SHORT_DESC_REQUIRED,
        body: articleValidationMsg.BODY_REQUIRED,
        publishDate: articleValidationMsg.PUBLISHED_DATE_REQUIRED,
        notValidDate: articleValidationMsg.NOT_VALID_DATE,
        author_not_valid: articleValidationMsg.AUTHOR_NOT_VALID,
        author_required: articleValidationMsg.AUTHOR_REQUIRED,
      };

      const testCases = [
        "title",
        "shortDescription",
        "body",
        "publishDate",
        "author",
      ];
      testCases.forEach((testCase) => {
        let testFields = fields;
        testFields = { ...testFields, [testCase]: "" };

        const { errors } = ArticleValidation.updateArticle(id, testFields);

        if (testCase === "publishDate") {
          expect(errors.length).toBe(2);
          expect(errors[0].message).toBe(`${testCase} is required`);
          expect(errors[1].message).toBe(errorMessages.notValidDate);
          return;
        }
        if (testCase === "author") {
          expect(errors.length).toBe(2);
          expect(errors[0].message).toBe(`${testCase} is required`);
          expect(errors[1].message).toBe(errorMessages.author_not_valid);
          return;
        }
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(`${testCase} is required`);
        return;
      });
      done();
    });

    it("should not throw any error if correct data and id is passed", (done) => {
      const id = mongoose.Types.ObjectId();
      const fields = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };

      const { errors } = ArticleValidation.updateArticle(id, fields);
      expect(errors.length).toBe(0);
      done();
    });
  });
});
