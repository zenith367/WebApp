import React, { useEffect, useState } from "react";
import axios from "axios";

import coursesImg from "../../assets/courses.jpg";
import reportsImg from "../../assets/reports.jpg";
import classesImg from "../../assets/classes.jpg";
import ratingsImg from "../../assets/ratings.jpg";

function PRLDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState(null);

  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch data per tab
  useEffect(() => {
    if (!activeTab) return;

    const endpoints = {
      courses: "https://backend-n6s1.onrender.com/api/prl/courses",
      reports: "https://backend-n6s1.onrender.com/api/prl/reports",
      classes: "https://backend-n6s1.onrender.com/api/prl/classes",
      ratings: "https://backend-n6s1.onrender.com/api/prl/ratings",
    };

    axios.get(endpoints[activeTab]).then((res) => {
      switch (activeTab) {
        case "courses":
          setCourses(res.data);
          break;
        case "reports":
          setReports(res.data);
          break;
        case "classes":
          setClasses(res.data);
          break;
        case "ratings":
          setRatings(res.data);
          break;
        default:
          break;
      }
    });
  }, [activeTab]);

  // ✅ Add feedback for specific report
  const addFeedback = async (reportId) => {
    const feedback = feedbacks[reportId] || "";
    if (!feedback.trim()) {
      alert("⚠️ Please enter feedback before saving.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/prl/reports/${reportId}/feedback`, { feedback });
      alert("✅ Feedback added successfully!");
      setFeedbacks({ ...feedbacks, [reportId]: "" });

      // Refresh reports
      const updated = await axios.get("http://localhost:5000/api/prl/reports");
      setReports(updated.data);
    } catch {
      alert("❌ Failed to save feedback");
    }
  };

  // ✅ Download Excel
  const downloadExcel = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/export/reports", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "prl_reports.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("❌ Failed to download Excel file");
    }
  };

  // ✅ Search filter
  const filterData = (data) =>
    data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>📖 PRL</h3>
        <ul>
          <li onClick={() => setActiveTab("courses")}>Courses</li>
          <li onClick={() => setActiveTab("reports")}>Reports</li>
          <li onClick={() => setActiveTab("classes")}>Classes</li>
          <li onClick={() => setActiveTab("ratings")}>Ratings</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <h2>Welcome, {user?.name}</h2>

        {/* Dashboard cards (hide when tab is open) */}
        {!activeTab && (
          <div className="card-grid">
            <div className="dash-card" onClick={() => setActiveTab("courses")}>
              <img src={coursesImg} alt="Courses" />
              <h4>Courses</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("reports")}>
              <img src={reportsImg} alt="Reports" />
              <h4>Reports</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("classes")}>
              <img src={classesImg} alt="Classes" />
              <h4>Classes</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("ratings")}>
              <img src={ratingsImg} alt="Ratings" />
              <h4>Ratings</h4>
            </div>
          </div>
        )}

        {/* Back button + search */}
        {activeTab && (
          <>
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={() => setActiveTab(null)}
            >
              ← Back to Dashboard
            </button>

            <input
              type="text"
              className="form-control mb-3"
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </>
        )}

        {/* 🧩 COURSES */}
        {activeTab === "courses" && (
          <div className="card p-3 mt-4">
            <h4>Courses & Lecturers</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {filterData(courses).map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.lecturer_name || "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 📝 REPORTS */}
        {activeTab === "reports" && (
          <div className="card p-3 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>Reports (with Feedback)</h4>
              <button className="btn btn-success btn-sm" onClick={downloadExcel}>
                ⬇ Download Excel
              </button>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Comments</th>
                  <th>Lecturer</th>
                  <th>Feedback</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterData(reports).map((r) => (
                  <tr key={r.id}>
                    <td>{r.course}</td>
                    <td>{r.topic}</td>
                    <td>{r.comments}</td>
                    <td>{r.lecturer_name}</td>
                    <td>{r.feedback || "No feedback yet"}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Add feedback"
                        value={feedbacks[r.id] || ""}
                        onChange={(e) =>
                          setFeedbacks({ ...feedbacks, [r.id]: e.target.value })
                        }
                      />
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => addFeedback(r.id)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🏫 CLASSES */}
        {activeTab === "classes" && (
          <div className="card p-3 mt-4">
            <h4>Classes</h4>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {filterData(classes).map((cl) => (
                  <tr key={cl.id}>
                    <td>{cl.name}</td>
                    <td>{cl.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ⭐ RATINGS */}
        {activeTab === "ratings" && (
          <div className="card p-3 mt-4">
            <h4>Ratings</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Student</th>
                </tr>
              </thead>
              <tbody>
                {filterData(ratings).map((r) => (
                  <tr key={r.id}>
                    <td>{r.course}</td>
                    <td>⭐ {r.rating}/5</td>
                    <td>"{r.feedback}"</td>
                    <td>{r.student_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default PRLDashboard;
