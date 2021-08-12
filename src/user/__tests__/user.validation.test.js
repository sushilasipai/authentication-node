const { registrationValidation } = require("../user.validation");
const { ValidationMessage } = require("../user.constraints");

const faker = require("faker");
describe("user validation test", () => {
  describe("user registration validation", () => {
    it("should return email errors if email not passed", (done) => {
      const data = {
        email: "",
        password: faker.internet.password(),
      };
      const { errors } = registrationValidation(data);
      expect(errors.length).toBe(2);
      expect(errors[0].message).toBe(ValidationMessage.EMAIL_REQUIRED);
      expect(errors[1].message).toBe(ValidationMessage.EMAIL_NOT_VALID);

      done();
    });

    it("should return password errors if password is not passed", (done) => {
      const data = {
        email: faker.internet.email(),
        password: "",
      };
      const { errors } = registrationValidation(data);
      expect(errors.length).toBe(2);
      expect(errors[0].message).toBe(ValidationMessage.PASSWORD_REQUIRED);
      expect(errors[1].message).toBe(ValidationMessage.PASSWORD_CHAR_ERROR);
      done();
    });

    it("should return email and password errors if email and password is not passed", (done) => {
      const data = {
        email: "",
        password: "",
      };
      const { errors } = registrationValidation(data);
      expect(errors.length).toBe(4);
      expect(errors[0].message).toBe(ValidationMessage.EMAIL_REQUIRED);
      expect(errors[1].message).toBe(ValidationMessage.EMAIL_NOT_VALID);
      expect(errors[2].message).toBe(ValidationMessage.PASSWORD_REQUIRED);
      expect(errors[3].message).toBe(ValidationMessage.PASSWORD_CHAR_ERROR);
      done();
    });

    it("should return no errors if valid email and password is passed", (done) => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const { errors } = registrationValidation(data);
      expect(errors.length).toBe(0);
      done();
    });
  });
});
