import React, { useState, useEffect } from "react";
import axios from "axios";

// Images
import reportsImg from "../../assets/reports.jpg";
import ratingsImg from "../../assets/ratings.jpg";
import monitoringImg from "../../assets/monitoring.jpg";

function LecturerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({
    student_id: "",
    course: "",
    topic: "",
    comments: "",
  });

  // ✅ Fetch ratings when needed
  useEffect(() => {
    if (user && activeTab === "ratings") {
      axios
        .get(`http://localhost:5000/api/lecturer/ratings/${user.id}`)
        .then((res) => setRatings(res.data))
        .catch((err) => console.error("❌ Error fetching ratings:", err));
    }
  }, [user, activeTab]);

  // ✅ Fetch reports only when needed
  useEffect(() => {
    if (user && activeTab === "reports") {
      axios
        .get(`http://localhost:5000/api/lecturer/reports/${user.id}`)
        .then((res) => setReports(res.data))
        .catch((err) => console.error("❌ Error fetching reports:", err));
    }
  }, [user, activeTab]);

  // ✅ Submit report
  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backend-n6s1.onrender.com/api/lecturer/report", {
        ...report,
        lecturer_id: user.id,
      });
      setReports([res.data, ...reports]);
      alert("✅ Report submitted!");
      setReport({ student_id: "", course: "", topic: "", comments: "" });
      setShowForm(false);
    } catch (err) {
      alert("❌ Failed to submit report");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>👨‍🏫 Lecturer</h3>
        <ul>
          <li onClick={() => setActiveTab("reports")}>Reports</li>
          <li onClick={() => setActiveTab("ratings")}>Ratings</li>
          <li onClick={() => setActiveTab("monitoring")}>Monitoring</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <h2>Welcome, {user?.name}</h2>

        {/* Dashboard Cards */}
        {!activeTab && (
          <div className="card-grid">
            <div className="dash-card" onClick={() => setActiveTab("reports")}>
              <img src={reportsImg} alt="Reports" />
              <h4>Reports</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("ratings")}>
              <img src={ratingsImg} alt="Ratings" />
              <h4>Student Ratings</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("monitoring")}>
              <img src={monitoringImg} alt="Monitoring" />
              <h4>Monitoring</h4>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeTab === "reports" && (
          <div className="card mt-4 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4>Reports</h4>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "➕ Add Report"}
              </button>
            </div>

            {/* Add Report Form */}
            {showForm && (
              <form className="mt-3" onSubmit={submitReport}>
                <div className="row">
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Student ID"
                      className="form-control mb-2"
                      value={report.student_id}
                      onChange={(e) =>
                        setReport({ ...report, student_id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      placeholder="Course"
                      className="form-control mb-2"
                      value={report.course}
                      onChange={(e) =>
                        setReport({ ...report, course: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      placeholder="Topic"
                      className="form-control mb-2"
                      value={report.topic}
                      onChange={(e) =>
                        setReport({ ...report, topic: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <textarea
                      placeholder="Comments"
                      className="form-control mb-2"
                      value={report.comments}
                      onChange={(e) =>
                        setReport({ ...report, comments: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button className="btn btn-success">Submit Report</button>
              </form>
            )}

            {/* Reports Table */}
            {reports.length > 0 ? (
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Topic</th>
                    <th>Comments</th>
                    <th>Student ID</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.course}</td>
                      <td>{r.topic}</td>
                      <td>{r.comments}</td>
                      <td>{r.student_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-3">No reports yet.</p>
            )}
          </div>
        )}

        {/* Ratings Section */}
        {activeTab === "ratings" && (
          <div className="card mt-4 p-3">
            <h4>Student Ratings</h4>
            {ratings.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.course}</td>
                      <td>⭐ {r.rating}/5</td>
                      <td>{r.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
        )}

        {/* Monitoring Section */}
        {activeTab === "monitoring" && (
          <div className="card mt-4 p-3">
            <h4>📊 Monitoring</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Total Students</th>
                  <th>Reports Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Web Development</td>
                  <td>35</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>Data Communication</td>
                  <td>28</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default LecturerDashboard;
