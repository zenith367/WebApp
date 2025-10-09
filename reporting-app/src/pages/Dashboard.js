import React from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2>Welcome to the Dashboard 🎉</h2>
        {user ? (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
          </>
        ) : (
          <p>No user data found. Try logging in again.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
