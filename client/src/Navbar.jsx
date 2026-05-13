import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ================= CHECK LOGIN =================

  const checkAuth = () => {

    try {

      const token = localStorage.getItem("token");
      const email = localStorage.getItem("adminEmail");

      // ✅ VALID LOGIN
      if (
        token &&
        email &&
        email !== "undefined" &&
        email !== "null" &&
        email.trim() !== ""
      ) {

        setIsLoggedIn(true);
        setAdminEmail(email);

      } else {

        // ❌ CLEAR INVALID DATA
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");

        setIsLoggedIn(false);
        setAdminEmail("");
      }

    } catch (error) {

      console.log(error);

      setIsLoggedIn(false);
      setAdminEmail("");
    }
  };

  // ================= RUN AUTH CHECK =================

  useEffect(() => {

    checkAuth();

    // ✅ UPDATE NAVBAR AFTER LOGIN / LOGOUT
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };

  }, [location.pathname]);

  // ================= CLOSE MOBILE MENU =================

  useEffect(() => {

    setMenuOpen(false);

  }, [location.pathname]);

  // ================= CLOSE DROPDOWN =================

  useEffect(() => {

    const handleClick = (e) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };

  }, [showDropdown]);

  // ================= LOGOUT =================

  const handleLogout = () => {

    // ✅ CLEAR STORAGE
    localStorage.clear();

    // ✅ RESET STATES
    setIsLoggedIn(false);
    setAdminEmail("");
    setShowDropdown(false);

    // ✅ UPDATE NAVBAR
    window.dispatchEvent(new Event("storage"));

    // ✅ GO HOME
    navigate("/");
  };

  // ================= AVATAR LETTER =================

  const avatarLetter =
    adminEmail && adminEmail !== "undefined"
      ? adminEmail.charAt(0).toUpperCase()
      : "";

  return (

    <header className="navbar">

      {/* ================= LOGO ================= */}

      <div className="logo-container">

        <img
          src={dwelledgeLogo}
          alt="Dwelledge Logo"
          className="logo-img"
        />

        <h2 className="logo-text">
          DWELLEDGE
        </h2>

      </div>

      {/* ================= MOBILE MENU ================= */}

      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >

        <span></span>
        <span></span>
        <span></span>

      </button>

      {/* ================= NAVBAR ================= */}

      <nav className={menuOpen ? "nav-open" : ""}>

        <ul className="nav-links">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/services">Services</Link>
          </li>

          <li>
            <Link to="/careers">Careers</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>

          {/* ================= LOGIN / PROFILE ================= */}

          <li>

            {isLoggedIn && avatarLetter ? (

              <div
                className="navbar-avatar-wrapper"
                ref={dropdownRef}
              >

                <button
                  className="navbar-avatar-btn"
                  onClick={() =>
                    setShowDropdown(!showDropdown)
                  }
                >
                  {avatarLetter}
                </button>

                {/* ================= DROPDOWN ================= */}

                {showDropdown && (

                  <div className="navbar-dropdown">

                    <div className="navbar-dropdown-header">

                      <div className="navbar-dropdown-avatar">
                        {avatarLetter}
                      </div>

                      <div>

                        <div className="navbar-dropdown-email">
                          {adminEmail}
                        </div>

                        <div className="navbar-dropdown-role">
                          Administrator
                        </div>

                      </div>
                    </div>

                    <hr className="navbar-dropdown-divider" />

                    <button
                      className="navbar-dropdown-item"
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
                      onClick={handleLogout}
                    >
                      ↩ Logout
                    </button>

                  </div>
                )}
              </div>

            ) : (

              <Link to="/login">
                Employee Login
              </Link>

            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;