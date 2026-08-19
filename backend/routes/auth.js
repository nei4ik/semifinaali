import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required.",
    });
  }

  try {
    const [teachers] = await db.execute(
      `SELECT id, username, password_hash
       FROM teachers
       WHERE username = ?`,
      [username]
    );

    const teacher = teachers[0];

    if (!teacher) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      teacher.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        return res.status(500).json({
          message: "Could not create session.",
        });
      }

      req.session.teacher = {
        id: teacher.id,
        username: teacher.username,
      };

      return res.json({
        teacher: req.session.teacher,
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
});

router.get("/me", (req, res) => {
  if (!req.session.teacher) {
    return res.status(401).json({
      teacher: null,
    });
  }

  return res.json({
    teacher: req.session.teacher,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Could not log out.",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(204).end();
  });
});

export default router;