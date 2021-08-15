const Article = require("./article.model");
const ArticleService = require("./article.service");

module.exports = new ArticleService(Article);
