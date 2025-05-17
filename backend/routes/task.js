const express = require("express");
const {
  readDatabase,
  writeDatabase,
  TASKS_DB_PATH,
} = require("../utils/dbHelper");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();
const redisClient = require("../utils/redisClient");

// All routes in this file are protected with authentication
router.use(authenticateToken);

// Get all tasks for the user
router.get("/", async (req, res) => {
  try {
    const cacheKey = `tasks:${req.user.id}`;

    // 1. Try getting from Redis first
    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      console.log("Serving tasks from Redis cache");
      return res.status(200).json(JSON.parse(cachedTasks));
    }

    // 2. If not cached, read from file
    const tasks = readDatabase(TASKS_DB_PATH);
    const userTasks = tasks.filter((task) => task.userId === req.user.id);
    // ✅ Store in Redis for next time
    await redisClient.set(cacheKey, JSON.stringify(userTasks));
    res.status(200).json(userTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const tasks = readDatabase(TASKS_DB_PATH);

    const newTask = {
      id: Date.now().toString(),
      userId: req.user.id,
      title,
      description: description || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    writeDatabase(TASKS_DB_PATH, tasks);
    // Invalidate Redis cache
    await redisClient.del(`tasks:${req.user.id}`);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task (toggle complete or edit)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const tasks = readDatabase(TASKS_DB_PATH);
    const taskIndex = tasks.findIndex(
      (task) => task.id === id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title !== undefined ? title : tasks[taskIndex].title,
      description:
        description !== undefined ? description : tasks[taskIndex].description,
      completed:
        completed !== undefined ? completed : tasks[taskIndex].completed,
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(TASKS_DB_PATH, tasks);
    // Invalidate cache
    await redisClient.del(`tasks:${req.user.id}`);

    res.status(200).json(tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = readDatabase(TASKS_DB_PATH);
    const filteredTasks = tasks.filter(
      (task) => !(task.id === id && task.userId === req.user.id)
    );

    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    writeDatabase(TASKS_DB_PATH, filteredTasks);
    // Invalidate cache
    await redisClient.del(`tasks:${req.user.id}`);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
