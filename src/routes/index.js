const express = require("express");
const userRouter = require("../user/user.route");
const router = express.Router();

router.get("/statuscheck", (req, res) => {
  return res.status(200).json({ message: "server is up and running" });
});

router.use("/user", userRouter);

module.exports = router;
