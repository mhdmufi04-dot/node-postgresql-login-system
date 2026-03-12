const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDsTYt03AbYa48mj1YedlKaG4ZlyBX3PoM");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Database pool configuration
const pool = new Pool({
  user: 'postgres',
  password: '2004',
  host: 'localhost',
  port: 5432,
  database: 'institute',
});

// Registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    res.json({
      success: true,
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Check session endpoint
app.get("/check-session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Protected enrollments endpoint
app.get("/enrollments", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(`
      SELECT students.name AS student,
             courses.name AS course,
             courses.fee,
             enrollment.enrollment_date
      FROM enrollment
      JOIN students ON enrollment.s_id = students.s_id
      JOIN courses ON enrollment.c_id = courses.c_id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Execute arbitrary SELECT queries (for demo purposes only).
// IMPORTANT: This is dangerous in production and should be restricted or removed.
app.post("/execute-query", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query string required" });
  }

  // rudimentary check to allow only SELECT statements
  const trimmed = query.trim().toLowerCase();
  if (!trimmed.startsWith("select")) {
    return res.status(400).json({ error: "Only SELECT queries are allowed" });
  }

  try {
    const result = await pool.query(query);
    res.json({ rows: result.rows, fields: result.fields.map(f => f.name) });
  } catch (error) {
    console.error("Query execution error:", error);
    res.status(500).json({ error: "Failed to execute query" });
  }
});

app.post("/ask-ai", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question text required" });
    }

    // use a model that actually exists for v1beta
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    });

    const result = await model.generateContent(question);
    console.log("AI result", result);

    const answer = result?.response?.text() || "";
    res.json({ answer });
  } catch (error) {
    console.error("Ask AI error:", error);
    res.status(500).json({ error: error.message || "AI error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});