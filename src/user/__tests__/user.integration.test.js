const app = require("../config/app.config");
const request = require("supertest");
const mongoose = require("mongoose");
const db = require("../config/db.config");
const envVars = require("../config/envVars.config");

describe("user integration test", () => {
  let server;
  beforeAll(async () => {
    await db.connectToDB(envVars.mongo_uri_test);

    server = await app.listen(3001);
  });

  afterAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    await server.close();
  });

  describe("User Registration test", () => {});
});
