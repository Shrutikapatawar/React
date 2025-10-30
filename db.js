const mysql = require('mysql2');

// Create a connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // your MySQL username
  password: 'root',        // your MySQL password (leave blank if none)
  database: 'kitchenqueen' // we’ll create this database next
});

// Connect and check if connection works
db.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL successfully!');
  }
});

module.exports = db;
