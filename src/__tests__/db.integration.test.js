const mongoose = require("mongoose");
const db = require("../config/db.config");
const envVars = require("../config/envVars.config");

describe("db integration test", () => {
  it("should be defined", (done) => {
    expect(db).toBeDefined();
    done();
  });

  beforeAll(async () => {
    await db.connectToDB(envVars.mongo_uri_test);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should connect to db successfully", (done) => {
    expect(mongoose.connection.readyState).toBe(1);
    done();
  });
});
