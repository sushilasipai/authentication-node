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

  validateId: (id) => {
    let errors = [];

    if (!ValidationCheck.validString(id)) {
      const error = {
        message: articleValidationMsg.ID_NOT_VALID,
      };
      errors = [...errors, error];
    }

    if (!ValidationCheck.validId(id)) {
      const error = {
        message: articleValidationMsg.ID_NOT_VALID,
      };
      errors = [...errors, error];
    }

    return { errors };
  },

  updateArticle: (id, fields) => {
    let errors = [];
    if (!ValidationCheck.validId(id)) {
      const error = {
        message: articleValidationMsg.ID_NOT_VALID,
      };
      errors = [...errors, error];
    }

    for (const field in fields) {
      if (!ValidationCheck.validString(fields[field])) {
        let error = new Error();
        error.message = `${field} is required`;
        errors = [...errors, error];
      }

      if (field === "author") {
        if (!ValidationCheck.validId(fields[field])) {
          let error = new Error();
          error.message = articleValidationMsg.AUTHOR_NOT_VALID;
          errors = [...errors, error];
        }
      }

      if (field === "publishDate") {
        if (!ValidationCheck.validDate(new Date(fields[field]))) {
          let error = new Error();
          error.message = articleValidationMsg.NOT_VALID_DATE;
          errors = [...errors, error];
        }
      }
    }

    return { errors };
  },
};

module.exports = ArticleValidation;
