const express = require("express");
const userRouter = require("../user/user.route");
const articleRouter = require("../article/article.route");
const router = express.Router();

router.get("/statuscheck", (req, res) => {
  return res.status(200).json({ message: "server is up and running" });
});

router.use("/user", userRouter);

router.use("/article", articleRouter);

module.exports = router;
