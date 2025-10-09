import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import limkokwingLogo from "../assets/limkokwing.png";

function Home() {
  return (
    <div className="home-wrapper">
      {/* 🔹 Top header with Limkokwing banner */}
      <header className="home-header">
        <img src={limkokwingLogo} alt="Limkokwing University" className="limkokwing-logo" />
        <h2 className="header-title">Limkokwing University of Creative Technology</h2>
      </header>

      {/* 🔹 Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">LUCT Reporting System</h1>
        <p className="hero-subtitle">
          A cutting-edge digital platform that empowers <b>Students</b>, <b>Lecturers</b>, and{" "}
          <b>Programme Leaders</b> to collaborate, monitor, and report progress effortlessly.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">
             Get Started
          </Link>
          <Link to="/register" className="btn btn-outline-light ms-3">
             Register
          </Link>
        </div>
      </section>

      {/* 🔹 Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h4>🎓 For Students</h4>
          <p>
            Access personalized dashboards, submit reports, and monitor academic feedback in real time.
          </p>
        </div>

        <div className="info-card">
          <h4>👨‍🏫 For Lecturers</h4>
          <p>
            Manage classes, track performance, and provide structured reports with clarity and precision.
          </p>
        </div>

        <div className="info-card">
          <h4>🏢 For Leaders</h4>
          <p>
            Gain academic oversight, review data insights, and evaluate performance across programs.
          </p>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="home-footer">
        crafted carefully by <b>Silence Traders</b> | Limkokwing University of Creative Technology, Lesotho
      </footer>
    </div>
  );
}

export default Home;
