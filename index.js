const app = require("./src/config/app.config");
const envVars = require("./src/config/envVars.config");
const db = require("./src/config/db.config");

db.connectToDB(envVars.mongo_uri)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(envVars.port ?? 3000, () => {
  console.log("Server started at", envVars.port ?? 3000);
});
