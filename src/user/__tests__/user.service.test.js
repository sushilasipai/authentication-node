const sinon = require("sinon");
const UserService = require("../user.service");
const faker = require("faker");

describe("user service test", () => {
  it("Should be defined", (done) => {
    expect(UserService).toBeDefined();
    done();
  });
  describe("create user test", () => {
    let CryptMock;
    let TokenGeneratorMock;
    beforeEach((done) => {
      CryptMock = {
        hashPassword: sinon.spy(),
      };

      TokenGeneratorMock = {
        generateUuidToken: sinon.spy(),
      };

      done();
    });

    it("Should call findOne and create method of the model", async () => {
      const UserMock = {
        findOne: sinon.spy(),
        create: sinon.spy(),
      };

      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: null,
        middleName: null,
        lastName: null,
        createdAt: null,
        updatedAt: null,
      };

      const userService = new UserService(
        UserMock,
        CryptMock,
        TokenGeneratorMock
      );
      await userService.createUser(data);
      expect(UserMock.findOne.calledOnce).toBeTruthy();
      expect(UserMock.create.calledAfter(CryptMock.hashPassword)).toBeTruthy();
      expect(CryptMock.hashPassword.calledOnce).toBeTruthy();
    });

    it("Should throw validation error if findOne returns true", async () => {
      const UserMock = {
        findOne: sinon.fake.returns(true),
        create: sinon.spy(),
      };

      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const userService = new UserService(
        UserMock,
        CryptMock,
        TokenGeneratorMock
      );
      try {
        await userService.createUser(data);
      } catch (error) {
        expect(UserMock.findOne.callCount).toBe(1);
        expect(CryptMock.hashPassword.calledOnce).toBeFalsy();
        expect(UserMock.create.calledAfter(CryptMock.hashPassword)).toBeFalsy();
        expect(error).toBeDefined();
        expect(error.type).toBe("ValidationError");
      }
    });
  });

  describe("forgot password test", () => {
    let CryptMock;
    let TokenGeneratorMock;
    beforeEach((done) => {
      CryptMock = {
        hashPassword: sinon.spy(),
      };

      TokenGeneratorMock = {
        generateUuidToken: sinon.spy(),
      };

      done();
    });
    it("should check for email on database", async () => {
      const UserMock = {
        findOne: sinon.fake.returns(true),
        updateOne: sinon.spy(),
      };

      const userService = new UserService(
        UserMock,
        CryptMock,
        TokenGeneratorMock
      );
      let email = faker.internet.email();

      await userService.forgotPassword(email);

      expect(UserMock.findOne.calledOnce).toBe(true);
      expect(TokenGeneratorMock.generateUuidToken.calledOnce).toBe(true);
      expect(UserMock.updateOne.calledOnce).toBe(true);
    });

    it("should  throw an error if user is not found", async () => {
      const UserMock = {
        findOne: sinon.fake.returns(null),
        updateOne: sinon.spy(),
      };
      let userService = new UserService(
        UserMock,
        CryptMock,
        TokenGeneratorMock
      );
      try {
        await userService.forgotPassword();
      } catch (error) {
        expect(UserMock.findOne.calledOnce).toBeTruthy();
        expect(error).toBeDefined();
        expect(error.type).toBe("ValidationError");
        expect(error.errors.length).toBe(1);
      }
    });
  });
});
