const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/auth");
const { ensureDatabaseExists } = require("../utils/dbHelper");

// Setup Express app for testing
const app = express();
app.use(bodyParser.json());
app.use("/auth", authRoutes);

ensureDatabaseExists();

describe("Auth API", () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: "password123",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register the same user again", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe(testUser.username);
  });
});
