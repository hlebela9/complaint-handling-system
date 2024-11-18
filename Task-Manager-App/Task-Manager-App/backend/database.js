// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./task-manager.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, userId INTEGER, name TEXT, description TEXT, dueDate TEXT, priority INTEGER)");
});

module.exports = db;
