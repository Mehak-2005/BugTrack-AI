const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/User");

const app = express();
const TEST_DB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bugtrack_test";

app.use(express.json());
app.use("/api/auth", authRoutes);

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";

 await mongoose.connect(TEST_DB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

describe("Authentication Tests", () => {
  test("Should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(
      "Account created successfully"
    );
  });

  test("Should reject registration with missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Name, email and password are required"
    );
  });

  test("Should login successfully with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Password123",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBeDefined();
  });

  test("Should reject login with incorrect password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "WrongPassword",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );
  });

  test("Should get current user with a valid JWT token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123",
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Password123",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(
      "testuser@example.com"
    );
  });

  test("Should reject access without a JWT token", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.statusCode).toBe(401);
  });
});