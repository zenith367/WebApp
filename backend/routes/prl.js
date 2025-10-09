const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get courses and lecturers under PRL
router.get("/courses", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.name AS lecturer_name
      FROM courses c
      LEFT JOIN users u ON c.lecturer_id = u.id
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View reports
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

// Add feedback to report
router.post("/reports/:id/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;
    const { id } = req.params;
    await db.query("UPDATE reports SET feedback=$1 WHERE id=$2", [feedback, id]);
    res.json({ message: "Feedback added successfully" });
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

// View all ratings
router.get("/ratings", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.name AS student_name
      FROM ratings r
      LEFT JOIN users u ON r.student_id = u.id
      ORDER BY r.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
