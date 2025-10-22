import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Images
import reportsImg from "../../assets/reports.jpg";
import ratingsImg from "../../assets/ratings.jpg";
import monitoringImg from "../../assets/monitoring.jpg";

// ✅ Fallback: Use Render API if available, else use localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rating, setRating] = useState({ rating: 1, feedback: "" });

  // 📊 Dummy data for monitoring charts
  const [monitoringData] = useState([
    { month: "Jan", reports: 3, ratings: 2 },
    { month: "Feb", reports: 4, ratings: 3 },
    { month: "Mar", reports: 6, ratings: 5 },
    { month: "Apr", reports: 5, ratings: 4 },
    { month: "May", reports: 7, ratings: 5 },
  ]);

  // Fetch reports
  useEffect(() => {
    if (user) {
      axios
        .get(`${API_BASE_URL}/api/student/reports`)
        .then((res) => setReports(res.data))
        .catch((err) => console.error("❌ Error fetching reports:", err));
    }
  }, [user]);

  // Submit rating
  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/student/rate`, {
        student_id: user.id,
        lecturer_id: selectedReport?.lecturer_id,
        course: selectedReport?.course,
        rating: rating.rating,
        feedback: rating.feedback,
      });
      alert("✅ Rating submitted!");
      setSelectedReport(null);
      setRating({ rating: 1, feedback: "" });
      setActiveTab(null);
    } catch (err) {
      alert("❌ Failed to submit rating");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>📚 Student</h3>
        <ul>
          <li onClick={() => setActiveTab("reports")}>Reports</li>
          <li onClick={() => setActiveTab("ratings")}>Ratings</li>
          <li onClick={() => setActiveTab("monitoring")}>Monitoring</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <h2>Welcome, {user?.name}</h2>

        {/* Cards Section */}
        {!activeTab && (
          <div className="card-grid">
            <div className="dash-card" onClick={() => setActiveTab("reports")}>
              <img src={reportsImg} alt="Reports" />
              <h4>{reports.length} Reports</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("ratings")}>
              <img src={ratingsImg} alt="Ratings" />
              <h4>Ratings</h4>
            </div>
            <div
              className="dash-card"
              onClick={() => setActiveTab("monitoring")}
            >
              <img src={monitoringImg} alt="Monitoring" />
              <h4>Monitoring</h4>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeTab === "reports" && (
          <div className="content-card">
            <button
              className="btn btn-outline-secondary view-back-btn"
              onClick={() => setActiveTab(null)}
            >
              ← Back
            </button>
            <h4>My Reports</h4>
            {reports.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Topic</th>
                    <th>Lecturer</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.course}</td>
                      <td>{r.topic}</td>
                      <td>{r.lecturer_name}</td>
                      <td>{r.comments}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setActiveTab("ratings");
                            setSelectedReport(r);
                          }}
                        >
                          ⭐ Rate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No reports yet.</p>
            )}
          </div>
        )}

        {/* Ratings Section */}
        {activeTab === "ratings" && (
          <div className="content-card">
            <button
              className="btn btn-outline-secondary view-back-btn"
              onClick={() => setActiveTab(null)}
            >
              ← Back
            </button>
            <h4>Rate a Lecturer</h4>
            {selectedReport ? (
              <form onSubmit={submitRating}>
                <p>
                  <b>{selectedReport.course}</b> – {selectedReport.lecturer_name}
                </p>
                <select
                  className="form-select mb-2"
                  value={rating.rating}
                  onChange={(e) =>
                    setRating({ ...rating, rating: e.target.value })
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      ⭐ {n}
                    </option>
                  ))}
                </select>
                <textarea
                  className="form-control mb-2"
                  placeholder="Feedback"
                  value={rating.feedback}
                  onChange={(e) =>
                    setRating({ ...rating, feedback: e.target.value })
                  }
                  required
                />
                <button className="btn btn-success">Submit</button>
              </form>
            ) : (
              <p>Select a report from Reports to rate.</p>
            )}
          </div>
        )}

        {/* 📊 Monitoring Section with Charts */}
        {activeTab === "monitoring" && (
          <div className="content-card">
            <button
              className="btn btn-outline-secondary view-back-btn"
              onClick={() => setActiveTab(null)}
            >
              ← Back
            </button>
            <h4>📊 Monitoring Overview</h4>
            <p>Reports vs Ratings over the semester</p>

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monitoringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#007bff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="ratings"
                  stroke="#00b894"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Bar Chart */}
            <div className="mt-4">
              <h5>📈 Reports and Ratings Summary</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monitoringData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" fill="#007bff" />
                  <Bar dataKey="ratings" fill="#00b894" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
