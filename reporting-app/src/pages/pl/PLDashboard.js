import React, { useEffect, useState } from "react";
import axios from "axios";

import coursesImg from "../../assets/courses.jpg";
import reportsImg from "../../assets/reports.jpg";
import classesImg from "../../assets/classes.jpg";
import ratingsImg from "../../assets/ratings.jpg";

// ✅ Fallback to localhost if not on Render
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function PLDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState(null);

  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [classes, setClasses] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Download Excel file
  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/export/reports`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pl_reports.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("❌ Failed to download Excel file");
    }
  };

  // ✅ Fetch data per active tab
  useEffect(() => {
    if (!activeTab) return;

    const endpoints = {
      courses: [`${API_BASE_URL}/api/pl/courses`, `${API_BASE_URL}/api/pl/lectures`],
      reports: [`${API_BASE_URL}/api/pl/reports`],
      ratings: [`${API_BASE_URL}/api/pl/ratings`],
      classes: [`${API_BASE_URL}/api/pl/classes`],
    };

    const fetchData = async () => {
      try {
        if (activeTab === "courses") {
          const [coursesRes, lecturersRes] = await Promise.all([
            axios.get(endpoints.courses[0]),
            axios.get(endpoints.courses[1]),
          ]);
          setCourses(coursesRes.data);
          setLecturers(lecturersRes.data);
        } else {
          const res = await axios.get(endpoints[activeTab][0]);
          switch (activeTab) {
            case "reports":
              setReports(res.data);
              break;
            case "ratings":
              setRatings(res.data);
              break;
            case "classes":
              setClasses(res.data);
              break;
            default:
              break;
          }
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, [activeTab]);

  // ✅ Filter function
  const filterData = (data) =>
    data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // ✅ Add course
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/pl/courses`, newCourse);
      setCourses([res.data, ...courses]);
      setNewCourse({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      alert("❌ Failed to add course");
    }
  };

  // ✅ Assign lecturer
  const assignLecturer = async (courseId, lecturerId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/pl/courses/${courseId}/assign`, {
        lecturer_id: lecturerId,
      });
      alert("✅ Lecturer assigned!");
    } catch (err) {
      alert("❌ Failed to assign lecturer");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>📘 Programme Leader</h3>
        <ul>
          <li onClick={() => setActiveTab("courses")}>Courses</li>
          <li onClick={() => setActiveTab("reports")}>Reports</li>
          <li onClick={() => setActiveTab("classes")}>Classes</li>
          <li onClick={() => setActiveTab("ratings")}>Ratings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Welcome, {user?.name}</h2>

        {/* ✅ Dashboard Cards */}
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

        {/* ✅ Back Button & Search Bar */}
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

        {/* 📚 COURSES */}
        {activeTab === "courses" && (
          <div className="card mt-4 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>Courses</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "➕ Add Course"}
              </button>
            </div>

            {showForm && (
              <form className="mt-3" onSubmit={addCourse}>
                <input
                  type="text"
                  placeholder="Course Name"
                  className="form-control mb-2"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="form-control mb-2"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
                <button className="btn btn-success">Save Course</button>
              </form>
            )}

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Description</th>
                  <th>Assign Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {filterData(courses).map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                    <td>
                      <select
                        className="form-select"
                        onChange={(e) => assignLecturer(c.id, e.target.value)}
                      >
                        <option value="">Select Lecturer</option>
                        {lecturers.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🧾 REPORTS */}
        {activeTab === "reports" && (
          <div className="card mt-4 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>Reports</h4>
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
                </tr>
              </thead>
              <tbody>
                {filterData(reports).map((r) => (
                  <tr key={r.id}>
                    <td>{r.course}</td>
                    <td>{r.topic}</td>
                    <td>{r.comments}</td>
                    <td>{r.lecturer_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🏫 CLASSES */}
        {activeTab === "classes" && (
          <div className="card mt-4 p-3">
            <h4>Classes</h4>
            <table className="table table-striped">
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
          <div className="card mt-4 p-3">
            <h4>Ratings Overview</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Average Rating</th>
                  <th>Total Ratings</th>
                </tr>
              </thead>
              <tbody>
                {filterData(ratings).map((r, i) => (
                  <tr key={i}>
                    <td>{r.lecturer_name}</td>
                    <td>⭐ {parseFloat(r.avg_rating).toFixed(1)}</td>
                    <td>{r.total}</td>
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

export default PLDashboard;
