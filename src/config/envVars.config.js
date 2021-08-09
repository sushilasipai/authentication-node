require("dotenv").config();

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  mongo_uri_test: process.env.MONGO_URI_TEST,
};

module.exports = config;
