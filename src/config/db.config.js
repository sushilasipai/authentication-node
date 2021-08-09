const mongoose = require("mongoose");

const connectToDB = async (uri) => {
  return await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

module.exports = { connectToDB };
