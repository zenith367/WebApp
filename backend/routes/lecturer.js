const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Create a report
router.post("/report", async (req, res) => {
  try {
    const { lecturer_id, course, topic, comments } = req.body;

    const result = await db.query(
      "INSERT INTO reports (lecturer_id, course, topic, comments) VALUES ($1,$2,$3,$4) RETURNING *",
      [lecturer_id, course, topic, comments]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error creating report:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get lecturer ratings
router.get("/ratings/:lecturerId", async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const result = await db.query(
      `SELECT r.id, r.course, r.rating, r.feedback, u.name AS student_name
       FROM ratings r
       LEFT JOIN users u ON r.student_id = u.id
       WHERE r.lecturer_id = $1
       ORDER BY r.id DESC`,
      [lecturerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching ratings:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get reports created by this lecturer
router.get("/reports/:lecturerId", async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const result = await db.query(
      "SELECT * FROM reports WHERE lecturer_id = $1 ORDER BY id DESC",
      [lecturerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get ALL classes (view only, no filters)
router.get("/classes", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name AS class_name, schedule FROM classes ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching classes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
