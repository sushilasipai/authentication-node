const Article = require("./article.model");
const { validId } = require("../utils/validations");
const { ID_NOT_VALID, NOT_AUTHORIZED } = require("./article.constraints");

const editAcl = async (req, res, next) => {
  const { _id } = req.user;
  const articleId = req.params.id;
  if (!validId(articleId)) {
    return res.status(400).json({
      type: "ValidationError",
      errors: [{ message: ID_NOT_VALID }],
    });
  }

  const { author } = await Article.findOne({ _id: articleId });
  if (author.toString() !== _id.toString()) {
    return res.status(401).json({
      type: "AuthorizationError",
      message: NOT_AUTHORIZED,
    });
  }
  next();
};

module.exports = {
  editAcl,
  deleteAcl: editAcl,
};
