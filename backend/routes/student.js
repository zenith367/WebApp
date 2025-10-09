const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Get ALL reports (for student monitoring)
router.get("/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.id, 
        r.course, 
        r.topic, 
        r.comments, 
        r.lecturer_id,   -- 👈 added so frontend can rate properly
        u.name AS lecturer_name
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      ORDER BY r.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Submit a rating
router.post("/rate", async (req, res) => {
  try {
    const { student_id, lecturer_id, course, rating, feedback } = req.body;

    if (!student_id || !lecturer_id || !course || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.query(
      `INSERT INTO ratings 
        (student_id, lecturer_id, course, rating, feedback, created_at) 
       VALUES ($1,$2,$3,$4,$5, NOW()) 
       RETURNING *`,
      [student_id, lecturer_id, course, rating, feedback]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error submitting rating:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
