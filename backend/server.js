const express = require("express");
const cors = require("cors");
const path = require("path");
const dbHelper = require("./utils/dbHelper");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Handle all other routes by serving the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Ensure database exists
dbHelper.ensureDatabaseExists();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
