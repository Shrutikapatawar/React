const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

// ✅ Log when this file is loaded
console.log("✅ authRoutes file loaded");

// 🔹 1️⃣ REGISTER - Create a new user
router.post('/register', (req, res) => {
  console.log("📩 Register route hit!", req.body);

  const { username, email, password } = req.body;

  // Check if all fields are filled
  if (!username || !email || !password) {
    console.log("⚠️ Missing fields in request body");
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save user to DB
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Error creating user:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log("🎉 User registered successfully:", result);
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    console.error("🔥 Unexpected error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 2️⃣ LOGIN - Authenticate user
router.post('/login', (req, res) => {
  console.log("🔐 Login route hit!", req.body);

  const { email, password } = req.body;

  // Find user by email
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Database error during login:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      console.log("⚠️ User not found with email:", email);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare entered password with hashed one
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for user:", email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'secret_key',
      { expiresIn: '1h' }
    );

    console.log("✅ Login successful for:", email);
    res.json({ message: 'Login successful', token });
  });
});

module.exports = router;
