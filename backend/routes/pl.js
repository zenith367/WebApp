// routes/pl.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =====================
// 📘 COURSES
// =====================

// Get all courses with lecturer info
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

// Add course
router.post("/courses", async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      "INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course
router.put("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.query(
      "UPDATE courses SET name=$1, description=$2 WHERE id=$3",
      [name, description, id]
    );
    res.json({ message: "Course updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM courses WHERE id=$1", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign lecturer
router.post("/courses/:id/assign", async (req, res) => {
  try {
    const { lecturer_id } = req.body;
    const { id } = req.params;
    await db.query("UPDATE courses SET lecturer_id=$1 WHERE id=$2", [
      lecturer_id,
      id,
    ]);
    res.json({ message: "Lecturer assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 👨‍🏫 LECTURERS
// =====================
router.get("/lectures", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name FROM users WHERE role='lecturer'"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 🧾 REPORTS (from PRL)
// =====================
router.get("/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.name AS lecturer_name, c.name AS course_name
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      LEFT JOIN courses c ON r.course_id = c.id
      ORDER BY r.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 🏫 CLASSES
// =====================
router.get("/classes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM classes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/classes", async (req, res) => {
  try {
    const { name, schedule } = req.body;
    const result = await db.query(
      "INSERT INTO classes (name, schedule) VALUES ($1, $2) RETURNING *",
      [name, schedule]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, schedule } = req.body;
    await db.query("UPDATE classes SET name=$1, schedule=$2 WHERE id=$3", [
      name,
      schedule,
      id,
    ]);
    res.json({ message: "Class updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM classes WHERE id=$1", [id]);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// ⭐ RATINGS
// =====================
router.get("/ratings", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.lecturer_id, 
        u.name AS lecturer_name,
        ROUND(AVG(r.rating), 2) AS avg_rating,
        COUNT(*) AS total
      FROM ratings r
      LEFT JOIN users u ON r.lecturer_id = u.id
      GROUP BY r.lecturer_id, u.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 🧾 LECTURER FORM
// =====================
router.get("/lecturer-form/:lecturerId", async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const result = await db.query(
      `SELECT * FROM lecturer_forms WHERE lecturer_id=$1 ORDER BY id DESC`,
      [lecturerId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/lecturer-form", async (req, res) => {
  try {
    const { lecturer_id, course_id, topic, comments } = req.body;
    if (!lecturer_id || !course_id || !topic)
      return res.status(400).json({ error: "Missing required fields" });

    const result = await db.query(
      `INSERT INTO lecturer_forms (lecturer_id, course_id, topic, comments)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [lecturer_id, course_id, topic, comments]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
