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

// Ensure database exists
dbHelper.ensureDatabaseExists();

// API Routes - these must come BEFORE the catch-all route
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
 
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
