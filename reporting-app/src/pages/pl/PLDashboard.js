import React, { useEffect, useState } from "react";
import axios from "axios";

import coursesImg from "../../assets/courses.jpg";
import reportsImg from "../../assets/reports.jpg";
import classesImg from "../../assets/classes.jpg";
import ratingsImg from "../../assets/ratings.jpg";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://backend-n6s1.onrender.com";

function PLDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState(null);

  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]); // from PRL
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [newClass, setNewClass] = useState({ name: "", schedule: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch data
  useEffect(() => {
    if (!activeTab) return;

    const endpoints = {
      courses: [
        `${API_BASE_URL}/api/pl/courses`,
        `${API_BASE_URL}/api/pl/lectures`,
      ],
      reports: [`${API_BASE_URL}/api/prl/reports`], // ✅ from PRL
      classes: [`${API_BASE_URL}/api/pl/classes`],
      ratings: [`${API_BASE_URL}/api/pl/ratings`],
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
            case "classes":
              setClasses(res.data);
              break;
            case "ratings":
              setRatings(res.data);
              break;
            default:
              break;
          }
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        alert("Failed to load data from backend.");
      }
    };
    fetchData();
  }, [activeTab]);

  const filterData = (data) =>
    data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  /* =======================
     COURSE MANAGEMENT
  ======================= */
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/pl/courses`, newCourse);
      setCourses([res.data, ...courses]);
      setShowForm(false);
      setNewCourse({ name: "", description: "" });
      alert("✅ Course added");
    } catch (err) {
      alert("❌ Failed to add course");
    }
  };

  const updateCourse = async (id, name, description) => {
    try {
      await axios.put(`${API_BASE_URL}/api/pl/courses/${id}`, {
        name,
        description,
      });
      setCourses(
        courses.map((c) => (c.id === id ? { ...c, name, description } : c))
      );
      alert("✅ Course updated!");
    } catch (err) {
      alert("❌ Failed to update");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/pl/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      alert("🗑️ Course deleted");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

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

  /* =======================
     CLASS MANAGEMENT
  ======================= */
  const addClass = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/pl/classes`, newClass);
      setClasses([res.data, ...classes]);
      setShowForm(false);
      setNewClass({ name: "", schedule: "" });
      alert("✅ Class added!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add class");
    }
  };

  const updateClass = async (id, name, schedule) => {
    try {
      await axios.put(`${API_BASE_URL}/api/pl/classes/${id}`, {
        name,
        schedule,
      });
      setClasses(
        classes.map((cl) => (cl.id === id ? { ...cl, name, schedule } : cl))
      );
      alert("✅ Class updated!");
    } catch (err) {
      alert("❌ Failed to update class");
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/pl/classes/${id}`);
      setClasses(classes.filter((cl) => cl.id !== id));
      alert("🗑️ Class deleted");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  /* =======================
     EXCEL EXPORT
  ======================= */
  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/export/reports`, {
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>📘 Programme Leader</h3>
        <ul>
          <li onClick={() => setActiveTab("courses")}>Courses</li>
          <li onClick={() => setActiveTab("reports")}>Reports (PRL)</li>
          <li onClick={() => setActiveTab("classes")}>Classes</li>
          <li onClick={() => setActiveTab("ratings")}>Ratings</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <h2>Welcome, {user?.name}</h2>

        {!activeTab && (
          <div className="card-grid">
            <div className="dash-card" onClick={() => setActiveTab("courses")}>
              <img src={coursesImg} alt="Courses" />
              <h4>Courses</h4>
            </div>
            <div className="dash-card" onClick={() => setActiveTab("reports")}>
              <img src={reportsImg} alt="Reports" />
              <h4>PRL Reports</h4>
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

        {activeTab && (
          <>
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={() => setActiveTab(null)}
            >
              ← Back
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

        {/* 📚 Courses */}
        {activeTab === "courses" && (
          <div className="card p-3">
            <div className="d-flex justify-content-between mb-3">
              <h4>Courses Management</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close" : "➕ Add Course"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={addCourse}>
                <input
                  type="text"
                  placeholder="Course name"
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
                    setNewCourse({
                      ...newCourse,
                      description: e.target.value,
                    })
                  }
                />
                <button className="btn btn-success">Save</button>
              </form>
            )}

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Lecturer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData(courses).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input
                        className="form-control"
                        defaultValue={c.name}
                        onBlur={(e) =>
                          updateCourse(c.id, e.target.value, c.description)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        defaultValue={c.description}
                        onBlur={(e) =>
                          updateCourse(c.id, c.name, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        onChange={(e) => assignLecturer(c.id, e.target.value)}
                      >
                        <option value="">Select</option>
                        {lecturers.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCourse(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🧾 Reports (from PRL) */}
        {activeTab === "reports" && (
          <div className="card p-3">
            <div className="d-flex justify-content-between mb-3">
              <h4>Reports from PRL</h4>
              <button className="btn btn-success btn-sm" onClick={downloadExcel}>
                ⬇ Export Excel
              </button>
            </div>
            {reports.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Topic</th>
                    <th>Lecturer</th>
                    <th>Comments</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData(reports).map((r) => (
                    <tr key={r.id}>
                      <td>{r.course}</td>
                      <td>{r.topic}</td>
                      <td>{r.lecturer_name}</td>
                      <td>{r.comments}</td>
                      <td>{r.feedback || "No feedback yet"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No reports available from PRL.</p>
            )}
          </div>
        )}

        {/* 🏫 Classes */}
        {activeTab === "classes" && (
          <div className="card p-3">
            <div className="d-flex justify-content-between mb-3">
              <h4>Classes Management</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close" : "➕ Add Class"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={addClass}>
                <input
                  type="text"
                  placeholder="Class Name"
                  className="form-control mb-2"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Schedule"
                  className="form-control mb-2"
                  value={newClass.schedule}
                  onChange={(e) =>
                    setNewClass({ ...newClass, schedule: e.target.value })
                  }
                />
                <button className="btn btn-success">Save Class</button>
              </form>
            )}

            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData(classes).map((cl) => (
                  <tr key={cl.id}>
                    <td>
                      <input
                        className="form-control"
                        defaultValue={cl.name}
                        onBlur={(e) =>
                          updateClass(cl.id, e.target.value, cl.schedule)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        defaultValue={cl.schedule}
                        onBlur={(e) =>
                          updateClass(cl.id, cl.name, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteClass(cl.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ⭐ Ratings */}
        {activeTab === "ratings" && (
          <div className="card p-3">
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
