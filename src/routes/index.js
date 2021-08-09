const express = require("express");

const router = express.Router();

router.get("/statuscheck", (req, res) => {
  return res.status(200).json({ message: "server is up and running" });
});

module.exports = router;
