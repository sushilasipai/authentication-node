const articleValidationMsg = require("./article.constraints");
const ValidationCheck = require("../utils/validations");

const ArticleValidation = {
  createArticle: ({ title, shortDescription, body, publishDate }) => {
    let errors = [];

    if (!ValidationCheck.validString(title)) {
      const error = {
        message: articleValidationMsg.TITLE_REQUIRED,
      };
      errors = [...errors, error];
    }

    if (!ValidationCheck.validString(shortDescription)) {
      const error = {
        message: articleValidationMsg.SHORT_DESC_REQUIRED,
      };
      errors = [...errors, error];
    }
    if (!ValidationCheck.validString(body)) {
      const error = {
        message: articleValidationMsg.BODY_REQUIRED,
      };
      errors = [...errors, error];
    }

    if (!ValidationCheck.validString(publishDate)) {
      const error = {
        message: articleValidationMsg.PUBLISHED_DATE_REQUIRED,
      };
      errors = [...errors, error];
    }

    if (!ValidationCheck.validDate(publishDate)) {
      const error = {
        message: articleValidationMsg.NOT_VALID_DATE,
      };
      errors = [...errors, error];
    }

    return { errors };
  },
};

module.exports = ArticleValidation;
