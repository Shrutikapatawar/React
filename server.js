const express = require('express');
const db = require('./db');
const authRoutes = require('./authRoutes'); // ✅ moved above

const app = express();
app.use(express.json()); // ✅ must be before routes

// ✅ use the routes first
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Hello KitchenQueen! Your server is working 👑');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
