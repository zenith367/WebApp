const ExcelJS = require("exceljs");

async function exportReports(reports) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reports");

  sheet.columns = [
    { header: "Faculty", key: "faculty" },
    { header: "Class", key: "class" },
    { header: "Course", key: "course" },
    { header: "Lecturer", key: "lecturer" },
    { header: "Date", key: "date" },
    { header: "Topic", key: "topic" },
    { header: "Students Present", key: "present" },
    { header: "Registered", key: "registered" },
    { header: "Venue", key: "venue" },
    { header: "Time", key: "time" },
    { header: "Outcomes", key: "outcomes" },
    { header: "Recommendations", key: "recommendations" }
  ];

  reports.forEach(report => sheet.addRow(report));
  return workbook.xlsx.writeBuffer();
}

module.exports = exportReports;
