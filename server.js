const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To handle JSON requests
app.use(express.static(__dirname));

// Initialize SQLite Database
const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error("Database error:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                sex TEXT,
                age INTEGER,
                role TEXT NOT NULL  -- Role column to store "Patient" or "Doc"
            )
        `);
        
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
        `);
    }
});
// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve index.html from the template directory
});
// User Registration Endpoint for Doctors
app.post("/register-doctor", async (req, res) => {
    const { username, password, name, sex, age, specialty } = req.body;

    // Check for required fields
    if (!username || !password || !name || !sex || !age || !specialty) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        // Check if the username already exists
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
            if (err) {
                console.error("Error checking username:", err.message);
                return res.status(500).json({ success: false, message: "An error occurred. Please try again." });
            }

            if (row) {
                return res.status(400).json({ success: false, message: "Username already exists. Please try again." });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Insert into users table
                db.run(
                    `INSERT INTO users (username, password, name, sex, age, role) VALUES (?, ?, ?, ?, ?, ?)`,
                    [username, hashedPassword, name, sex, parseInt(age), 'Doc'],
                    (err) => {
                        if (err) {
                            console.error("Error inserting data:", err.message);
                            return res.status(500).json({ success: false, message: "An error occurred during registration. Please try again." });
                        } else {
                            // Insert into doctors table
                            db.run(
                                `INSERT INTO doctors (username, name, sex, age, specialty, availability) VALUES (?, ?, ?, ?, ?, ?)`,
                                [username, name, sex, parseInt(age), specialty, 'no'], // Default availability is 'no'
                                (err) => {
                                    if (err) {
                                        console.error("Error inserting data into doctors table:", err.message);
                                        return res.status(500).json({ success: false, message: "An error occurred during doctor registration. Please try again." });
                                    } else {
                                        return res.json({ success: true, message: "Doctor registration successful!" });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ success: false, message: "An error occurred during registration. Please try again." });
    }
});

// User Registration Endpoint for Patients
app.post("/register", async (req, res) => {
    const { username, password, name, sex, age, role } = req.body;

    // Check for required fields
    if (!username || !password || !name || !sex || !age || !role) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        // Check if the username already exists
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
            if (err) {
                console.error("Error checking username:", err.message);
                return res.status(500).json({ success: false, message: "An error occurred. Please try again." });
            }
            
            if (row) {
                return res.status(400).json({ success: false, message: "Username already exists. Please try again." });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Insert into users table
                db.run(
                    `INSERT INTO users (username, password, name, sex, age, role) VALUES (?, ?, ?, ?, ?, ?)`,
                    [username, hashedPassword, name, sex, parseInt(age), role],
                    (err) => {
                        if (err) {
                            console.error("Error inserting data:", err.message);
                            return res.status(500).json({ success: false, message: "An error occurred during registration. Please try again." });
                        } else {
                            return res.json({ success: true, message: "Registration successful!" });
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ success: false, message: "An error occurred during registration. Please try again." });
    }
});

// User Login Endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    try {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
            if (err) {
                console.error("Error checking username:", err.message);
                return res.status(500).json({ success: false, message: "An error occurred. Please try again." });
            }

            if (!row) {
                return res.json({ success: false });
            }

            const match = await bcrypt.compare(password, row.password);
            if (match) {
                res.json({ success: true, name: row.name, role: row.role });
            } else {
                res.json({ success: false });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "An error occurred during login. Please try again." });
    }
});
// Update Availability Endpoint
app.post("/update-availability", async (req, res) => {
    const { availability, name } = req.body; // Ensure you're using name correctly

    if (!name || !availability) {
        return res.status(400).json({ success: false, message: "Name and availability are required." });
    }

    try {
        db.run(`UPDATE doctors SET availability = ? WHERE name = ?`, [availability, name], function(err) {
            if (err) {
                console.error("Error updating availability:", err.message);
                return res.status(500).json({ success: false, message: "An error occurred while updating availability." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: "Doctor not found." });
            }

            return res.json({ success: true, message: "Availability updated successfully!" });
        });
    } catch (error) {
        console.error("Error during availability update:", error);
        return res.status(500).json({ success: false, message: "An error occurred while updating availability." });
    }
});

// Hugging Face API Key and Model Name
const API_KEY = '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'; // Replace with your actual API key
const MODEL_NAME = 'meta-llama/Llama-3.2-3B'; // Model you want to use

// Function to generate a healthcare insight based on the prompt
async function getHealthcareInsight(prompt, max_length = 250, temperature = 0.2, top_k = 10, top_p = 0.8) {
    const url = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;
    
    try {
        const response = await axios.post(url, {
            inputs: prompt,
            parameters: {
                max_length: max_length,
                temperature: temperature,
                top_k: top_k,
                top_p: top_p,
            },
        }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data[0].generated_text; // Adjust according to the actual response structure
    } catch (error) {
        console.error("Error generating text:", error);
        return "An error occurred while generating the recommendation.";
    }
}

// Endpoint for processing user queries
app.post('/query', async (req, res) => {
    const { query } = req.body;

    // Validate the input
    if (!query) {
        return res.status(400).json({ response: 'Query cannot be empty.' });
    }

    // Generate a refined prompt based on user input
    const refinedPrompt = query;

    // Get the response from the Hugging Face model
    try {
        const recommendation = await getHealthcareInsight(refinedPrompt, 1000, 0.2, 30, 0.8);
        
        // Post-process to remove leading repetitions of the input query
        const cleanedResponse = recommendation.replace(new RegExp(`^${query}`, 'i'), '').trim(); // Remove any leading repeat of the query

        return res.json({ response: cleanedResponse });
    } catch (error) {
        console.error("Error in /query endpoint:", error);
        return res.status(500).json({ response: 'An error occurred while processing your query.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
