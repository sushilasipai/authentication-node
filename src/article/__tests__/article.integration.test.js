const app = require("../../config/app.config");
const db = require("../../config/db.config");
const envVars = require("../../config/envVars.config");
const request = require("supertest");
const faker = require("faker");
const { Crypt } = require("../../user/user.utils");
const User = require("../../user/user.model");
const mongoose = require("mongoose");
const TokenGenerator = require("../../utils/token");
const Article = require("../article.model");
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
    afterAll(async () => {
      await Article.deleteMany({});
    });
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

  describe("get all articles test", () => {
    afterAll(async () => {
      await Article.deleteMany({});
    });
    it("should return emtpy array if no data is found", async () => {
      const response = await request(server).get("/api/article").expect(200);
      expect(response.body).toHaveProperty("articles");
      expect(response.body.articles.length).toBe(0);
    });

    it("should return all articles found", async () => {
      const article = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };
      await Article.create({ ...article });
      const response = await request(server).get("/api/article").expect(200);
      expect(response.body).toHaveProperty("articles");
      expect(response.body.articles.length).toBe(1);
      expect(response.body.articles[0]).toHaveProperty("title");
      expect(response.body.articles[0]).toHaveProperty("shortDescription");
      expect(response.body.articles[0]).toHaveProperty("body");
      expect(response.body.articles[0]).toHaveProperty("author");
      expect(response.body.articles[0]).toHaveProperty("publishDate");
    });
  });

  describe("get  article by id test", () => {
    afterAll(async () => {
      await Article.deleteMany({});
    });
    it("should return 400 if id is not valid", async () => {
      await request(server).get("/api/article/1").expect(400);
    });

    it("should return null if id is valid and article is not found", async () => {
      const id = mongoose.Types.ObjectId();
      const response = await request(server)
        .get("/api/article/" + id)
        .expect(200);
      expect(response.body).toHaveProperty("article", null);
    });

    it("should return article with that id if  found", async () => {
      const article = {
        title: faker.lorem.text(),
        shortDescription: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        author: mongoose.Types.ObjectId(),
        publishDate: new Date(),
      };
      const createdArticle = await Article.create({ ...article });
      const response = await request(server)
        .get(`/api/article/${createdArticle._id}`)
        .expect(200);
      expect(response.body).toHaveProperty("article");
      expect(response.body.article).toHaveProperty("title", article.title);
      expect(response.body.article).toHaveProperty(
        "shortDescription",
        article.shortDescription
      );
      expect(response.body.article).toHaveProperty("body", article.body);
      expect(response.body.article).toHaveProperty(
        "author",
        article.author.toString()
      );
      expect(response.body.article).toHaveProperty("publishDate");
      expect(response.body.article).toHaveProperty("publishDate");
      expect(response.body.article).toHaveProperty("_id");
    });
  });
});
