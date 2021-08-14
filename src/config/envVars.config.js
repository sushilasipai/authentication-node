require("dotenv").config();

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  mongo_uri_test: process.env.MONGO_URI_TEST,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  from_user_email: process.env.FROM_USER_EMAIL,
};

module.exports = config;
