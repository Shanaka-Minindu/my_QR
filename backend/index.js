import express from "express";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";

// Initialize app and config
const app = express();
env.config();
const port = process.env.PORT || 3001;
const saltRounds = 10;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to DB
db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth API running" });
});

// Registration endpoint
app.post("/register", async (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user exists
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await db.query(
      "INSERT INTO users (email, hash_password, userName) VALUES ($1, $2, $3) RETURNING id, email, userName",
      [email, hash, userName]
    );

    res.status(201).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // Find user
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].hash_password
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({
      success: true,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        userName: user.rows[0].userName,
      },
    });
    console.log("done")
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start server
app.listen(port, () => {
  console.log(`Auth server running on port ${port}`);
});
