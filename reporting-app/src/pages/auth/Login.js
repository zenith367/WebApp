import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ Save both token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful");

      // ✅ redirect by role
      if (res.data.user.role === "student") navigate("/student-dashboard");
      else if (res.data.user.role === "lecturer") navigate("/lecturer-dashboard");
      else if (res.data.user.role === "prl") navigate("/prl-dashboard");
      else if (res.data.user.role === "pl") navigate("/pl-dashboard");
      else navigate("/"); // fallback
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="card p-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={change}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
