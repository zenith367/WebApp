import React from "react";

function LecturerForm() {
  return (
    <div className="card p-4">
      <h3>Lecturer Reporting Form</h3>
      <form>
        <div className="mb-3">
          <label>Faculty Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Class Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Week of Reporting</label>
          <input type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Date of Lecture</label>
          <input type="date" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Course Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Course Code</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Lecturer’s Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Actual Students Present</label>
          <input type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Total Registered Students</label>
          <input type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Venue</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Scheduled Lecture Time</label>
          <input type="time" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Topic Taught</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Learning Outcomes</label>
          <textarea className="form-control"></textarea>
        </div>
        <div className="mb-3">
          <label>Lecturer’s Recommendations</label>
          <textarea className="form-control"></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit Report</button>
      </form>
    </div>
  );
}

export default LecturerForm;
