const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM courses ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add course
router.post("/courses", async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      "INSERT INTO courses (name, description) VALUES ($1,$2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign lecturer to course
router.post("/courses/:id/assign", async (req, res) => {
  try {
    const { lecturer_id } = req.body;
    const { id } = req.params;
    await db.query("UPDATE courses SET lecturer_id=$1 WHERE id=$2", [lecturer_id, id]);
    res.json({ message: "Lecturer assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all lecturers
router.get("/lectures", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name FROM users WHERE role='lecturer'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View reports from PRL
router.get("/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.name AS lecturer_name
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      ORDER BY r.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View classes
router.get("/classes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM classes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ratings overview
router.get("/ratings", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT lecturer_id, AVG(rating) as avg_rating, COUNT(*) as total
      FROM ratings
      GROUP BY lecturer_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
