const express = require("express");
const router = express.Router();
const db = require("../config/db");
const ExcelJS = require("exceljs");

// 🧾 Download all reports as Excel
router.get("/reports", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.id, r.course, r.topic, r.comments, u.name AS lecturer_name
      FROM reports r
      LEFT JOIN users u ON r.lecturer_id = u.id
      ORDER BY r.id DESC
    `);

    // Create workbook & sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reports");

    // Headers
    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Course", key: "course", width: 25 },
      { header: "Topic", key: "topic", width: 25 },
      { header: "Comments", key: "comments", width: 30 },
      { header: "Lecturer Name", key: "lecturer_name", width: 25 },
    ];

    // Add rows
    sheet.addRows(result.rows);

    // Generate file
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reports.xlsx");

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.error("❌ Excel export failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
