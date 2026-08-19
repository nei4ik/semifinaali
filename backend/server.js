import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Works" });
});

app.get("/api/categories", async (req, res) => {
  try {
    const teacherId = Number(req.query.teacherId);

    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      return res.status(400).json({
        error: "Valid teacherId is required",
      });
    }

    const [rows] = await db.execute(
      "SELECT id, name FROM categories WHERE teacher_id = ?",
      [teacherId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/teachers", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username FROM teachers"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const categoryId = Number(req.query.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        error: "Valid categoryId is required",
      });
    }

    const [rows] = await db.execute(
      `SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
      FROM questions
      WHERE category_id = ?
      ORDER BY id`,
      [categoryId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

app.post("/api/categories", async (req, res) => {
  const { name, teacherId } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO categories (name, teacher_id) VALUES (?, ?)",
      [name, teacherId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      teacher_id: teacherId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not create category",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});