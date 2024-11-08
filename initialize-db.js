const sqlite3 = require('sqlite3').verbose();

// Create a new database connection (will create the file if it doesn't exist)
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    // Drop doctors table if it exists
    db.run(`DROP TABLE IF EXISTS doctors`, (err) => {
        if (err) {
            console.error('Error dropping doctors table:', err.message);
        } else {
            console.log('Doctors table dropped (if it existed).');
        }
    });

    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            sex TEXT,
            age INTEGER,
            role TEXT NOT NULL  -- Role column added to store "Patient" or "Doc"
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created or already exists.');
        }
    });

    // Doctors table
    db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            sex TEXT,
            age INTEGER,
            specialty TEXT,
            availability TEXT DEFAULT 'no'  -- Default availability for doctors
        )
    `, (err) => {
        if (err) {
            console.error('Error creating doctors table:', err.message);
        } else {
            console.log('Doctors table created or already exists.');
        }
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
