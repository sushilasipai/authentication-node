const app = require("../../config/app.config");
const request = require("supertest");
const mongoose = require("mongoose");
const db = require("../../config/db.config");
const envVars = require("../../config/envVars.config");
const faker = require("faker");
const { ValidationMessage } = require("../user.constraints");
const User = require("../user.model");
const { Crypt } = require("../user.utils");
const uuid = require("uuid");
const TokenGenerator = require("../../utils/token");
describe("user integration test", () => {
  let server;

  let user;
  let password = faker.internet.password();

  beforeAll(async () => {
    await db.connectToDB(envVars.mongo_uri_test);
    server = await app.listen(3001);

    user = {
      email: "sipaisushila@gmail.com",
      password: await Crypt.hashPassword(password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    //Create a test user
    user = await User.create({ ...user });
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

  describe("User password reset token generation test", () => {
    it("should throw validation email error if invalid email is passed", async () => {
      const data = {
        email: "",
      };

      const response = await request(server)
        .post("/api/user/forgotpassword")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(1);
    });

    it("should throw email not registered email if email not registered in db", async () => {
      const data = {
        email: "abcd@gmail.com",
      };

      const response = await request(server)
        .post("/api/user/forgotpassword")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(1);
    });

    it("should throw token if email found on db", async () => {
      const data = {
        email: user.email,
      };

      const response = await request(server)
        .post("/api/user/forgotpassword")
        .send(data)
        .expect(200);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("User login test", () => {
    it("should throw ValidationError if email and password is not sent", async () => {
      const data = {
        email: "",
        password: "",
      };

      const response = await request(server)
        .post("/api/user/login")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(4);
    });

    it("should throw AuthorizationError if email is not found", async () => {
      const data = {
        email: "abcd@gmail.com",
        password: faker.internet.password(),
      };

      const response = await request(server)
        .post("/api/user/login")
        .send(data)
        .expect(401);
    });

    it("should throw AuthorizationError if password is incorrect", async () => {
      const data = {
        email: user.email,
        password: "fsdfsdfds",
      };

      const response = await request(server)
        .post("/api/user/login")
        .send(data)
        .expect(401);
    });

    it("should successfully login if password match", async () => {
      const data = {
        email: user.email,
        password: password,
      };

      const response = await request(server)
        .post("/api/user/login")
        .send(data)
        .expect(200);

      expect(response.body.user).toHaveProperty("email", data.email);
      expect(response.body.token).toBeDefined();
    });
  });

  describe("User Registration test", () => {
    it("should successfully register", async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(200);
    });

    it("should return validation error in email empty", async () => {
      const data = {
        email: "",
        password: faker.internet.password(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(2);
    });

    it("should return email not valid error when invalid email is passed", async () => {
      const data = {
        email: "abcd",
        password: faker.internet.password(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");

      expect(response.body.errors.length).toBe(1);
    });

    it("should return email duplicate error when duplicate email is passed", async () => {
      const data = {
        email: user.email,
        password: faker.internet.password(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");

      expect(response.body.message).toBe(
        ValidationMessage.EMAIL_ALREADY_EXISTS
      );
    });

    it("should return password errors when password not passed", async () => {
      const data = {
        email: faker.internet.email(),
        password: "",
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(2);
    });

    it("should return password length error when password is less than 8 characters", async () => {
      const data = {
        email: faker.internet.email(),
        password: "1234",
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(400);

      expect(response.body.type).toBe("ValidationError");
      expect(response.body.errors.length).toBe(1);
    });

    it("should save first name to database when passed", async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(200);

      expect(response.body.savedUser).toHaveProperty(
        "firstName",
        data.firstName
      );
    });

    it("should save middle name to database when passed", async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        middleName: faker.name.middleName(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(200);

      expect(response.body.savedUser).toHaveProperty(
        "middleName",
        data.middleName
      );
    });

    it("should save middle name to database when passed", async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        lastName: faker.name.lastName(),
      };

      const response = await request(server)
        .post("/api/user/register")
        .send(data)
        .expect(200);

      expect(response.body.savedUser).toHaveProperty("lastName", data.lastName);
    });
  });

  describe("User password reset test", () => {
    let passwordResetToken = uuid.v4();
    beforeAll(async () => {
      await User.updateOne({ email: user.email }, { passwordResetToken });
    });

    it("should throw password mismatch error if newpassword does not match confirmpassword", async () => {
      const data = {
        newPassword: "abc",
        confirmPassword: "lfjdsl",
      };

      const response = await request(server)
        .post("/api/user/resetpassword")
        .send(data)
        .expect(400);

      expect(response.body.errors.length).toBe(2);
    });

    it("should throw token mismatch error if wrong token is passed", async () => {
      const data = {
        token: "sfsfs",
        newPassword: "abcdefgh",
        confirmPassword: "abcdefgh",
      };

      const response = await request(server)
        .post("/api/user/resetpassword")
        .send(data)
        .expect(400);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.type).toBe("ValidationError");
    });

    it("should return 200 if password successfully changed", async () => {
      const data = {
        token: passwordResetToken,
        newPassword: "asdfghjkl",
        confirmPassword: "asdfghjkl",
      };

      const response = await request(server)
        .post("/api/user/resetpassword")
        .send(data)
        .expect(200);
    });
  });

  describe("me test", () => {
    //Generate JWT
    let token;
    let expiredToken;
    beforeAll(() => {
      token = TokenGenerator.generateJwtToken(user._id);
      expiredToken = TokenGenerator.backDateToken(user._id, 30);
    });

    it("Should throw Authentication error if token is expired", async () => {
      const response = await request(server)
        .get("/api/user/me")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);
      expect(response.body.type).toBe("AuthenticationError");
      expect(response.body.message).toBe("Token Expired");
    });

    it("Should throw Authentication error if token is not passed", async () => {
      const response = await request(server).get("/api/user/me").expect(401);
      expect(response.body.type).toBe("AuthenticationError");
      expect(response.body.message).toBe("Something went wrong!!");
    });

    it("Should throw Authentication error if wrong token is passed", async () => {
      const response = await request(server)
        .get("/api/user/me")
        .set("Authorization", "Bearer fsdfdsvdsffsd")
        .expect(401);
      expect(response.body.type).toBe("AuthenticationError");
      expect(response.body.message).toBe("Something went wrong!!");
    });

    it("Should throw no error if correct token is passed", async () => {
      const response = await request(server)
        .get("/api/user/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body).toHaveProperty("user");
    });
  });
});
