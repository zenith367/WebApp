const express = require("express");
const router = express.Router();
const db = require("../config/db");
const ExcelJS = require("exceljs");

/* =========================================================
   🟦 1️⃣ COURSES — Fetch all courses & assigned lecturers
========================================================= */
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
    console.error("❌ Error fetching courses:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🟦 2️⃣ REPORTS — View all lecturer reports
========================================================= */
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
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🟦 3️⃣ FEEDBACK — Add or update feedback on report
========================================================= */
router.post("/reports/:id/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;
    const { id } = req.params;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ error: "Feedback cannot be empty" });
    }

    await db.query("UPDATE reports SET feedback = $1 WHERE id = $2", [
      feedback,
      id,
    ]);
    res.json({ message: "✅ Feedback added successfully" });
  } catch (err) {
    console.error("❌ Error adding feedback:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🟦 4️⃣ CLASSES — View all classes
========================================================= */
router.get("/classes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM classes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching classes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🟦 5️⃣ RATINGS — View all ratings with student names
========================================================= */
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
    console.error("❌ Error fetching ratings:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🟦 6️⃣ EXPORT — Export all reports to Excel (for PRL)
========================================================= */
router.get("/export/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.course, r.topic, r.comments, u.name AS lecturer_name, r.feedback
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      ORDER BY r.id DESC
    `);

    // Create workbook & sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PRL Reports");

    // Define columns
    sheet.columns = [
      { header: "Course", key: "course", width: 20 },
      { header: "Topic", key: "topic", width: 25 },
      { header: "Comments", key: "comments", width: 30 },
      { header: "Lecturer", key: "lecturer_name", width: 20 },
      { header: "Feedback", key: "feedback", width: 30 },
    ];

    // Add rows
    result.rows.forEach((row) => sheet.addRow(row));

    // Styling
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF007BFF" },
    };

    // Send file as download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=prl_reports.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Excel export error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
