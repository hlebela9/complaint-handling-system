// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'secret123'; // Use env variable for production

// Middleware to check JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

// User Registration
app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, role], function(err) {
    if (err) return res.status(500).send("There was a problem registering the user.");
    res.status(200).send({ id: this.lastID });
  });
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send("Login failed.");
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
});

// Task CRUD operations
app.post('/tasks', verifyToken, (req, res) => {
  const { name, description, dueDate, priority } = req.body;
  db.run("INSERT INTO tasks (userId, name, description, dueDate, priority) VALUES (?, ?, ?, ?, ?)", [req.userId, name, description, dueDate, priority], function(err) {
    if (err) return res.status(500).send("Error creating task.");
    res.status(200).send({ id: this.lastID });
  });
});

app.get('/tasks', verifyToken, (req, res) => {
  db.all("SELECT * FROM tasks WHERE userId = ?", [req.userId], (err, rows) => {
    if (err) return res.status(500).send("Error retrieving tasks.");
    res.status(200).send(rows);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
