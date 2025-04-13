const fs = require("fs");
const path = require("path");

// Database paths
const USERS_DB_PATH = path.join(__dirname, "..", "data", "users.json");
const TASKS_DB_PATH = path.join(__dirname, "..", "data", "tasks.json");

// Create data directory and files if they don't exist
const ensureDatabaseExists = () => {
  const dataDir = path.join(__dirname, "..", "data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(USERS_DB_PATH)) {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify([]));
  }

  if (!fs.existsSync(TASKS_DB_PATH)) {
    fs.writeFileSync(TASKS_DB_PATH, JSON.stringify([]));
  }
};

// Database helper functions
const readDatabase = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const writeDatabase = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
  ensureDatabaseExists,
  readDatabase,
  writeDatabase,
  USERS_DB_PATH,
  TASKS_DB_PATH,
};
