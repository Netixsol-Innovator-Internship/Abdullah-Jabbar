const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

let mongoServer;
let app;

beforeAll(async () => {
  // Set env vars before requiring app
  process.env.JWT_SECRET = "testsecret";
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();

  // Now require app after env is set
  app = require("../../server");

  // Connect to DB
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("E2E: Auth and Tasks", () => {
  let token;

  beforeEach(async () => {
    // Register and login for each test
    await request(app).post("/api/users/register").send({
      name: "Test",
      email: "test@example.com",
      password: "password",
    });
    const loginRes = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password",
    });
    token = loginRes.body.token;
  });

  test("registers a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test2",
      email: "test2@example.com",
      password: "password",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My Task" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("My Task");
  });

  test("gets tasks for user", async () => {
    // Create a task first
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My Task" });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
