const app = require("../../config/app.config");
const db = require("../../config/db.config");
const envVars = require("../../config/envVars.config");
const request = require("supertest");
const faker = require("faker");
const { Crypt } = require("../../user/user.utils");
const User = require("../../user/user.model");
const mongoose = require("mongoose");
const TokenGenerator = require("../../utils/token");

describe("article integration test", () => {
  let server;
  let jwt;

  beforeAll(async () => {
    await db.connectToDB(envVars.mongo_uri_test);
    server = await app.listen(3001);

    let user = {
      email: "sipaisushila@gmail.com",
      password: await Crypt.hashPassword(faker.internet.password()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    //Create a test user
    user = await User.create({ ...user });
    //create jwt token
    jwt = `Bearer ${TokenGenerator.generateJwtToken(user._id)}`;
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

  describe("create article test", () => {
    it("should throw error if valid article data is not passed", async () => {
      const article = {};

      const response = await request(server)
        .post("/api/article/create")
        .set("Authorization", jwt)
        .send(article)
        .expect(400);
    });

    it("should create article if valid article data is passed", async () => {
      const article = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };

      const response = await request(server)
        .post("/api/article/create")
        .set("Authorization", jwt)
        .send(article)
        .expect(200);

      expect(response.body).toHaveProperty("article");
    });
  });
});
