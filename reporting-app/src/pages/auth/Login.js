import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Define backend base URL (auto switch between local & hosted)
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://backend-n6s1.onrender.com"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use fallback URL automatically
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ Save token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful");

      // ✅ Redirect by role
      switch (res.data.user.role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "lecturer":
          navigate("/lecturer-dashboard");
          break;
        case "prl":
          navigate("/prl-dashboard");
          break;
        case "pl":
          navigate("/pl-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-3 text-center">Login</h3>
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
