// server.js - SQLite Version
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import multer from "multer";

// Load environment variables
import "dotenv/config";

// Update CORS for production
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : [
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:3000",
            "http://localhost:8080",
          ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Fix for __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 📁 Configure file uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📘 Initialize SQLite database
let db;
(async () => {
  try {
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });

    // 🗃️ CREATE ALL TABLES AT ONCE
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        matric TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        image TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        matric TEXT NOT NULL,
        candidate_id INTEGER NOT NULL,
        position TEXT NOT NULL,
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(matric, position)
      )
    `);

    console.log("✅ SQLite database and tables ready");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();

// 🧩 Helper function: Validate Microbiology matric number
function validMicroMatric(matric) {
  return /^\d{9}$/.test(matric) && matric.slice(2, 6) === "0561";
}

// ==================== AUTHENTICATION ROUTES ====================

// 🧱 REGISTER route
app.post("/register", async (req, res) => {
  try {
    const { fullname, matric, password } = req.body;

    if (!fullname || !matric || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!validMicroMatric(matric)) {
      return res
        .status(400)
        .json({ error: "Invalid matric number (Not a Microbiology student)." });
    }

    const existing = await db.get("SELECT * FROM users WHERE matric = ?", [
      matric,
    ]);

    if (existing) {
      return res
        .status(409)
        .json({ error: "Matric number already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (fullname, matric, password) VALUES (?, ?, ?)",
      [fullname, matric, hashed]
    );

    console.log(`🧾 New user registered: ${fullname} (${matric})`);
    res.status(201).json({
      message: "Registration successful!",
      fullname,
      matric,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 🔐 LOGIN route
app.post("/login", async (req, res) => {
  try {
    const { matric, password } = req.body;

    if (!matric || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await db.get("SELECT * FROM users WHERE matric = ?", [matric]);
    if (!user) {
      return res.status(404).json({ error: "Matric number not found." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    res.json({
      message: "Login successful!",
      matric: user.matric,
      fullname: user.fullname,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ==================== CANDIDATE ROUTES ====================

// ➕ POST /addCandidate - Add new candidate
app.post("/addCandidate", upload.single("image"), async (req, res) => {
  try {
    const { fullname, position } = req.body;

    if (!fullname || !position) {
      return res
        .status(400)
        .json({ error: "Candidate name and position are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Candidate photo is required" });
    }

    // Check if candidate already exists for this position
    const existingCandidate = await db.get(
      "SELECT * FROM candidates WHERE name = ? AND position = ?",
      [fullname, position]
    );

    if (existingCandidate) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({
        error: `${fullname} is already a candidate for ${position} position`,
      });
    }

    // Insert new candidate
    await db.run(
      "INSERT INTO candidates (name, position, image) VALUES (?, ?, ?)",
      [fullname, position, req.file.filename]
    );

    console.log(`✅ New candidate added: ${fullname} for ${position}`);
    res.json({
      message: `Candidate ${fullname} added successfully for ${position}!`,
      candidate: {
        name: fullname,
        position: position,
        image: req.file.filename,
      },
    });
  } catch (error) {
    console.error("❌ Error adding candidate:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to add candidate" });
  }
});

// 📋 GET /candidates - Get all candidates
app.get("/candidates", async (req, res) => {
  try {
    const candidates = await db.all(`
            SELECT * FROM candidates 
            ORDER BY 
                CASE position 
                    WHEN 'PRESIDENT' THEN 1
                    WHEN 'VICE-PRESIDENT' THEN 2
                    WHEN 'GENERAL SECRETARY' THEN 3
                    WHEN 'SOCIAL DIRECTOR' THEN 4
                    WHEN 'WELFARE DIRECTOR' THEN 5
                    WHEN 'SPORT DIRECTOR' THEN 6
                    WHEN 'PUBLIC RELATIONS OFFICER' THEN 7
                    ELSE 8
                END, name
        `);
    res.json(candidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

// 🗑️ DELETE /candidates/:id - Delete candidate
app.delete("/candidates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await db.get("SELECT * FROM candidates WHERE id = ?", [
      id,
    ]);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    await db.run("DELETE FROM candidates WHERE id = ?", [id]);
    await db.run("DELETE FROM votes WHERE candidate_id = ?", [id]);

    const imagePath = path.join(__dirname, "uploads", candidate.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    console.log(`🗑️ Candidate deleted: ${candidate.name} (ID: ${id})`);
    res.json({
      message: `Candidate ${candidate.name} deleted successfully`,
      deletedCandidate: candidate,
    });
  } catch (error) {
    console.error("❌ Error deleting candidate:", error);
    res.status(500).json({ error: "Failed to delete candidate" });
  }
});

// ==================== VOTING ROUTES ====================

// ✅ POST /submitVote - Submit vote
app.post("/submitVote", async (req, res) => {
  try {
    const { matric, votes } = req.body;

    if (!matric || !votes || !Array.isArray(votes)) {
      return res.status(400).json({ error: "Invalid vote data" });
    }

    // Check for duplicate votes
    for (const vote of votes) {
      const existingVote = await db.get(
        "SELECT * FROM votes WHERE matric = ? AND position = ?",
        [matric, vote.position]
      );

      if (existingVote) {
        return res.status(409).json({
          error: `You have already voted for ${vote.position} position`,
        });
      }
    }

    // Process votes
    for (const vote of votes) {
      await db.run(
        "INSERT INTO votes (matric, candidate_id, position) VALUES (?, ?, ?)",
        [matric, vote.candidate_id, vote.position]
      );

      await db.run("UPDATE candidates SET votes = votes + 1 WHERE id = ?", [
        vote.candidate_id,
      ]);
    }

    console.log(`🗳️ Vote cast by ${matric} for ${votes.length} position(s)`);
    res.json({
      message: "Vote submitted successfully! Thank you for voting.",
      votesCount: votes.length,
    });
  } catch (error) {
    console.error("❌ Error submitting vote:", error);
    res.status(500).json({ error: "Failed to submit vote" });
  }
});

// 🔍 GET /checkVote/:matric - Check if user has voted
app.get("/checkVote/:matric", async (req, res) => {
  try {
    const { matric } = req.params;
    const votes = await db.all("SELECT * FROM votes WHERE matric = ?", [
      matric,
    ]);

    res.json({
      hasVoted: votes.length > 0,
      votes: votes,
      votesCount: votes.length,
    });
  } catch (error) {
    console.error("❌ Error checking vote status:", error);
    res.status(500).json({ error: "Failed to check vote status" });
  }
});

// ==================== RESULTS ROUTES ====================

// 📊 GET /results - Get voting results
app.get("/results", async (req, res) => {
  try {
    const results = await db.all(`
            SELECT 
                c.position,
                c.name,
                c.image,
                c.votes,
                (SELECT COUNT(*) FROM votes v2 WHERE v2.position = c.position) as total_votes_position,
                (SELECT COUNT(DISTINCT matric) FROM votes) as total_voters
            FROM candidates c
            ORDER BY 
                CASE c.position 
                    WHEN 'PRESIDENT' THEN 1
                    WHEN 'VICE-PRESIDENT' THEN 2
                    WHEN 'GENERAL SECRETARY' THEN 3
                    WHEN 'SOCIAL DIRECTOR' THEN 4
                    WHEN 'WELFARE DIRECTOR' THEN 5
                    WHEN 'SPORT DIRECTOR' THEN 6
                    WHEN 'PUBLIC RELATIONS OFFICER' THEN 7
                    ELSE 8
                END, c.votes DESC
        `);
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// ==================== HEALTH CHECK ====================

// 🩺 Health check route
app.get("/", (req, res) => {
  res.send("✅ NAMS Backend server running locally");
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
