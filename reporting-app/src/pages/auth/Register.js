import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      alert(res.data.message || "Registered");
      navigate("/login");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.response?.data?.error || "Registration failed"));
    }
  };

  return (
    <div className="card p-4">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Name</label>
          <input name="name" onChange={change} value={form.name} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" onChange={change} value={form.email} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" onChange={change} value={form.password} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" onChange={change} value={form.role} className="form-control">
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="prl">PRL</option>
            <option value="pl">PL</option>
          </select>
        </div>
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
    </div>
  );
}
