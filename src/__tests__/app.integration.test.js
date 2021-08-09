const app = require("../config/app.config");
const request = require("supertest");

describe("app integration test", () => {
  it("app should be defined", (done) => {
    expect(app).toBeDefined();
    done();
  });

  let server;
  beforeAll(async () => {
    server = await app.listen(3001);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("api/statuscheck route to be mounted", () => {
    it("returns 200", async () => {
      await request(server).get("/api/statuscheck").expect(200);
    });
  });
});
