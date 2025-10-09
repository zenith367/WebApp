import React, { useEffect, useState } from "react";
import axios from "axios";

// Images
import reportsImg from "../../assets/reports.jpg";
import ratingsImg from "../../assets/ratings.jpg";
import monitoringImg from "../../assets/monitoring.jpg";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState(null); // default null (show cards)
  const [selectedReport, setSelectedReport] = useState(null);
  const [rating, setRating] = useState({ rating: 1, feedback: "" });

  // Fetch reports
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/student/reports")
        .then((res) => setReports(res.data))
        .catch((err) => console.error("❌ Error fetching reports:", err));
    }
  }, [user]);

  // Submit rating
  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/student/rate", {
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
            <div className="dash-card" onClick={() => setActiveTab("monitoring")}>
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
                />
                <button className="btn btn-success">Submit</button>
              </form>
            ) : (
              <p>Select a report from Reports to rate.</p>
            )}
          </div>
        )}

        {/* Monitoring Section */}
        {activeTab === "monitoring" && (
          <div className="content-card">
            <button
              className="btn btn-outline-secondary view-back-btn"
              onClick={() => setActiveTab(null)}
            >
              ← Back
            </button>
            <h4>📊 Monitoring</h4>
            <p>Monitoring statistics will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
