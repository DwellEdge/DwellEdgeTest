import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const dropdownRef = useRef(null);

  // ================= CHECK LOGIN =================
  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("adminEmail");

      const hasToken =
        token && token !== "undefined" && token !== "null" && token.trim() !== "";

      if (hasToken) {
        setIsLoggedIn(true);

        const hasEmail =
          email && email !== "undefined" && email !== "null" && email.trim() !== "";

        setAdminEmail(hasEmail ? email : "");
      } else {
        setIsLoggedIn(false);
        setAdminEmail("");
      }

      setAuthLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
      setAdminEmail("");
      setAuthLoading(false);
    }
  };

  // ================= RUN AUTH CHECK =================
  useEffect(() => {
    checkAuth();

    // This helps when you manually dispatch "storage" after login/logout
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  // ================= CLOSE MOBILE MENU ON NAV =================
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showDropdown]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");

    setIsLoggedIn(false);
    setAdminEmail("");
    setShowDropdown(false);

    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };

  // ================= AVATAR LETTER =================
  const avatarLetter =
    adminEmail && adminEmail.trim() !== ""
      ? adminEmail.charAt(0).toUpperCase()
      : "A";

  return (
    <header className="navbar">
      {/* ================= LOGO ================= */}
      <div className="logo-container">
        <Link to="/">
          <img src={dwelledgeLogo} alt="Dwelledge Logo" className="logo-img" />
        </Link>
        <h2 className="logo-text">
          <Link to="/">DWELLEDGE</Link>
        </h2>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ================= NAVBAR ================= */}
      <nav className={menuOpen ? "nav-open" : ""}>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              About
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/services"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Services
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/careers"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Careers
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Contact
            </NavLink>
          </li>

          {/* ================= LOGIN / PROFILE ================= */}
          <li>
            {!authLoading &&
              (isLoggedIn ? (
                <div className="navbar-avatar-wrapper" ref={dropdownRef}>
                  <button
                    className="navbar-avatar-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                    type="button"
                  >
                    {avatarLetter}
                  </button>

                  {showDropdown && (
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-header">
                        <div className="navbar-dropdown-avatar">{avatarLetter}</div>
                        <div>
                          <div className="navbar-dropdown-email">
                            {adminEmail || "admin"}
                          </div>
                          <div className="navbar-dropdown-role">Administrator</div>
                        </div>
                      </div>

                      <hr className="navbar-dropdown-divider" />

                      <button
                        className="navbar-dropdown-item"
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/admin");
                        }}
                      >
                        🖥 Dashboard
                      </button>

                      <hr className="navbar-dropdown-divider" />

                      <button
                        className="navbar-dropdown-item navbar-dropdown-logout"
                        type="button"
                        onClick={handleLogout}
                      >
                        ↩ Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">Employee Login</Link>
              ))}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;