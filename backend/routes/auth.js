const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  readDatabase,
  writeDatabase,
  USERS_DB_PATH,
} = require("../utils/dbHelper");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const users = readDatabase(USERS_DB_PATH);

    // Check if user already exists
    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
    };

    users.push(newUser);
    writeDatabase(USERS_DB_PATH, users);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readDatabase(USERS_DB_PATH);
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create and assign token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.log("err",err)
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
