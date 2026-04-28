const Database = require("better-sqlite3");
const db = new Database("susu.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT UNIQUE,
  password TEXT,
  wallet REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE,
  user_id INTEGER,
  amount REAL
);
`);

console.log("SQLite ready ✅");

module.exports = db;