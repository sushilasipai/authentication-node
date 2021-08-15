const mongoose = require("mongoose");
const { Schema } = mongoose;
const articleValidationMsg = require("./article.constraints");

const articleSchema = new Schema({
  title: {
    type: String,
    required: articleValidationMsg.TITLE_REQUIRED,
    index: true,
  },
  shortDescription: {
    type: String,
    required: articleValidationMsg.SHORT_DESC_REQUIRED,
  },
  body: {
    type: String,
    required: articleValidationMsg.BODY_REQUIRED,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: articleValidationMsg.AUTHOR_REQUIRED,
  },
  publishDate: {
    type: Date,
    required: articleValidationMsg.PUBLISHED_DATE_REQUIRED,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
