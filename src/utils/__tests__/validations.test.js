const {
  validEmail,
  validString,
  validStringLength,
} = require("../validations");

describe("validation test", () => {
  describe("Valid string test", () => {
    it("should return false if empty string is passed", (done) => {
      expect(validString("")).toBeFalsy();
      done();
    });

    it("should return false if string is undefined", (done) => {
      expect(validString()).toBeFalsy();
      done();
    });

    it("should return true if valid string is passed", (done) => {
      expect(validString("sdfsd")).toBeTruthy();
      done();
    });
  });

  describe("valid email", () => {
    it("should return false if email is empty", (done) => {
      expect(validEmail("")).toBeFalsy();
      done();
    });

    it("should return false if email is undefined", (done) => {
      expect(validEmail()).toBeFalsy();
      done();
    });

    it("should return false if @ not in email", (done) => {
      expect(validEmail("dsfds.com")).toBeFalsy();
      done();
    });

    it("should return false if @@ is passed in email", (done) => {
      expect(validEmail("dsjfds@fl@gmail.com")).toBeFalsy();
      done();
    });

    it("should return false if . not passed in email", (done) => {
      expect(validEmail("dsdfsd@gmail")).toBeFalsy();
      done();
    });

    it("should return true if valid email is passed", (done) => {
      expect(validEmail("sipaisushila@gmail.com")).toBeTruthy();
      done();
    });
  });

  describe("valid string length", () => {
    it("should return true if string is of valid lenth", (done) => {
      expect(validStringLength("dsfjdsldsl", 4)).toBeTruthy();
      done();
    });

    it("should return false if string is of invalid lenth", (done) => {
      expect(validStringLength("dsfjdsldsl", 17)).toBeFalsy();
      done();
    });
  });
});
