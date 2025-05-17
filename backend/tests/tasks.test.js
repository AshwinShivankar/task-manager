const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const taskRoutes = require("../routes/task");
const authRoutes = require("../routes/auth");
const { ensureDatabaseExists } = require("../utils/dbHelper");

const app = express();
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Ensure JSON files and data dir exist
ensureDatabaseExists();

let token = "";
let taskId = "";

beforeAll(async () => {
  const testUser = { username: "taskuser", password: "taskpass123" };

  // Register user
  await request(app).post("/auth/register").send(testUser);

  // Login user
  const res = await request(app).post("/auth/login").send(testUser);
  token = res.body.token;
});

describe("Task API", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Test task description",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    taskId = res.body.id; // Save for later tests
  });

  it("should get all tasks for the user", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === taskId)).toBe(true);
  });

  it("should update the task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        completed: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
    expect(res.body.completed).toBe(true);
  });

  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

  it("should return 404 for deleted task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Should Not Work" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });
});
