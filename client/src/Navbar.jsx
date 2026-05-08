import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">

      {/* LOGO */}
      <div className="logo-container">
        <img src={dwelledgeLogo} alt="Dwelledge Logo" className="logo-img" />

        <h2
          className="logo-text"
          onClick={() => navigate("/")}
        >
          DWELLEDGE
        </h2>
      </div>

      {/* HAMBURGER */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>

        <Link to="/services" onClick={() => setMenuOpen(false)}>
          Services
        </Link>

        <Link to="/careers" onClick={() => setMenuOpen(false)}>
          Careers
        </Link>

        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>

        <button
          className="employee-login-btn"
          onClick={() => navigate("/login")}
        >
          Employee Login
        </button>
      </nav>

    </header>
  );
}

export default Navbar;