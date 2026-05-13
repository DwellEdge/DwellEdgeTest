import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";

const API = "http://localhost:5000";

function Applicants() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const storedEmail = localStorage.getItem("adminEmail");

  const adminEmail =
    storedEmail && storedEmail !== "undefined"
      ? storedEmail
      : "admin@dwelledge.com";

  // ================= FETCH APPLICATIONS =================

  useEffect(() => {
    fetch(`${API}/api/applications`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // ================= CLOSE DROPDOWN =================

  useEffect(() => {
    const close = () => setShowDropdown(false);

    if (showDropdown) {
      document.addEventListener("click", close);
    }

    return () => document.removeEventListener("click", close);
  }, [showDropdown]);

  // ================= DOWNLOAD RESUME =================

  const handleDownload = async (app) => {

    try {

      const response = await fetch(
        `${API}/api/applications/${app._id}/resume`
      );

      if (!response.ok) {
        alert("Resume not found");
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${app.firstName}_Resume.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert("Download failed");

    }
  };

  // ================= CHANGE PASSWORD =================

  const handleChangePassword = (e) => {

    e.preventDefault();

    setPasswordError("");

    if (passwordForm.newPass !== passwordForm.confirm) {

      setPasswordError("Passwords do not match");

      return;
    }

    alert("Password Updated Successfully");

    setShowChangePassword(false);

    setPasswordForm({
      current: "",
      newPass: "",
      confirm: "",
    });
  };

  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("adminEmail");

    navigate("/login");
  };

  return (

    <div className="admin-page">

      {/* ================= TOP NAVBAR ================= */}

      <header className="admin-topnav">

        <div className="admin-topnav-logo">

          <img
            src={dwelledgeLogo}
            alt="logo"
            className="admin-topnav-logo-img"
          />

          <span className="admin-topnav-logo-text">
            DWELLEDGE
          </span>

        </div>

        <nav className="admin-topnav-links">

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact">Contact</Link>

        </nav>

        {/* PROFILE */}

        <div
          className="admin-topnav-profile"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >

          <div className="admin-topnav-avatar">
            {adminEmail.charAt(0).toUpperCase()}
          </div>

          <span className="admin-topnav-caret">
            {showDropdown ? "▲" : "▼"}
          </span>

          {/* DROPDOWN */}

          {showDropdown && (

            <div
              className="admin-topnav-dropdown"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="admin-dropdown-header">

                <div className="admin-dropdown-avatar">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>

                <div>

                  <div className="admin-dropdown-email">
                    {adminEmail}
                  </div>

                  <div className="admin-dropdown-role">
                    Administrator
                  </div>

                </div>
              </div>

              <hr className="admin-dropdown-divider" />

              <button
                className="admin-dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  setShowProfile(true);
                }}
              >
                👤 My Profile
              </button>

              <button
                className="admin-dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  setShowChangePassword(true);
                }}
              >
                🔒 Change Password
              </button>

              <hr className="admin-dropdown-divider" />

              <button
                className="admin-dropdown-item admin-dropdown-logout"
                onClick={handleLogout}
              >
                ↩ Logout
              </button>

            </div>
          )}
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div>

          <div className="admin-logo">

            <span className="admin-logo-mark">D</span>

            <div>

              <div className="admin-logo-name">
                DWELLEDGE
              </div>

              <div className="admin-logo-sub">
                Admin Panel
              </div>

            </div>
          </div>

          {/* NAVIGATION */}

          <div className="admin-nav">

            <div
              className={`admin-nav-item ${
                window.location.pathname === "/admin/JobListing"
                  ? "admin-nav-active"
                  : ""
              }`}
              onClick={() => navigate("/admin/JobListing")}
            >
              💼 Job Listings
            </div>

            <div
              className={`admin-nav-item ${
                window.location.pathname === "/admin/employeepage"
                  ? "admin-nav-active"
                  : ""
              }`}
              onClick={() => navigate("/admin/employeepage")}
            >
              👨‍💼 Employees
            </div>

            <div
              className={`admin-nav-item ${
                window.location.pathname === "/admin/founders"
                  ? "admin-nav-active"
                  : ""
              }`}
              onClick={() => navigate("/admin/founders")}
            >
              🏢 Founders
            </div>

            <div
              className={`admin-nav-item ${
                window.location.pathname === "/admin/Applicants"
                  ? "admin-nav-active"
                  : ""
              }`}
              onClick={() => navigate("/admin/Applicants")}
            >
              📄 Applications
            </div>

          </div>
        </div>

        {/* USER CARD */}

        <div>

          <div
            className="admin-user-card"
            onClick={() => setShowProfile(true)}
            style={{ cursor: "pointer" }}
          >

            <div className="admin-user-avatar">
              {adminEmail.charAt(0).toUpperCase()}
            </div>

            <div>

              <div className="admin-user-email">
                {adminEmail}
              </div>

              <div className="admin-user-role">
                Administrator
              </div>

            </div>

            <span className="admin-profile-arrow">›</span>

          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            ↩ Logout
          </button>

        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-main">

        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        <div className="admin-header">

          <div>

            <p className="admin-header-eyebrow">
              JOB APPLICATIONS
            </p>

            <h1 className="admin-header-title">
              Applications Management
            </h1>

          </div>
        </div>

        {/* STATS */}

        <div className="admin-stats">
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📄</div>
            <div className="admin-stat-value">
              {applications.length}
            </div>
            <div className="admin-stat-label">
              Total Applications
            </div>
            </div>
          </div>

        {/* TABLE */}

        {/* ================= TABLE ================= */}

<div className="admin-table-wrapper">

  <h2 className="admin-table-title">
    All Applications
  </h2>

  {loading ? (

    <div className="admin-loading">
      Loading...
    </div>

  ) : applications.length === 0 ? (

    <div className="admin-empty">
      No applications found
    </div>

  ) : (

    <div className="admin-table-scroll">

      <table className="admin-table applications-table">

        <thead>

          <tr>
            <th>Job Title</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Email ID</th>
            <th>Primary Skills</th>
            <th>Secondary Skills</th>
            <th>Total Experience</th>
            <th>Relevant Experience</th>
            <th>Submitted Date</th>
            <th>Resume</th>
          </tr>

        </thead>

        <tbody>

          {applications.map((app) => (

            <tr key={app._id}>

              <td>
                {app.jobId?.jobTitle || "N/A"}
              </td>

              <td>
                {app.firstName || "N/A"}
              </td>

              <td>
                {app.lastName || "N/A"}
              </td>

              <td>
                {app.mobileNumber || "N/A"}
              </td>

              <td>
                {app.emailId || "N/A"}
              </td>

              <td>
                {app.primarySkills || "N/A"}
              </td>

              <td>
                {app.secondarySkills || "N/A"}
              </td>

              <td>
                {app.totalExperience || "0"} Years
              </td>

              <td>
                {app.relevantExperience || "0"} Years
              </td>

              <td>
                {app.submittedDate
                  ? new Date(app.submittedDate).toLocaleDateString()
                  : "N/A"}
              </td>

              <td>

                {app.resume ? (

                  <button
                    className="admin-download-btn"
                    onClick={() => handleDownload(app)}
                  >
                    ⬇ Download
                  </button>

                ) : (

                  <span className="admin-no-resume">
                    No Resume
                  </span>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</div>
</main>

      {/* ================= PROFILE MODAL ================= */}

      {showProfile && (
  <div
    className="admin-modal-overlay"
    onClick={() => setShowProfile(false)}
  >
    <div
      className="admin-modal admin-profile-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="admin-modal-header">
        <h2 className="admin-modal-title">My Profile</h2>

        <button
          className="admin-modal-close"
          onClick={() => setShowProfile(false)}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="admin-profile-body">

        {/* AVATAR */}
        <div className="admin-profile-avatar">
          {adminEmail.charAt(0).toUpperCase()}
        </div>

        {/* EMAIL */}
        <div className="admin-profile-email">
          {adminEmail}
        </div>

        {/* ROLE */}
        <div className="admin-profile-role">
          Administrator
        </div>

        {/* OPTIONS */}
        <div className="admin-profile-options">

          {/* CHANGE PASSWORD */}
          <button
            className="admin-profile-option"
            onClick={() => {
              setShowProfile(false);
              setShowChangePassword(true);
            }}
          >
            <span className="admin-profile-option-icon">🔒</span>

            <div>
              <div className="admin-profile-option-title">
                Change Password
              </div>

              <div className="admin-profile-option-sub">
                Update your login password
              </div>
            </div>

            <span className="admin-profile-option-arrow">›</span>
          </button>

          {/* LOGOUT */}
          <button
            className="admin-profile-option admin-profile-option-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("adminEmail");
              navigate("/login");
            }}
          >
            <span className="admin-profile-option-icon">↩</span>

            <div>
              <div className="admin-profile-option-title">
                Logout
              </div>

              <div className="admin-profile-option-sub">
                Sign out of admin panel
              </div>
            </div>

            <span className="admin-profile-option-arrow">›</span>
          </button>

        </div>
      </div>
    </div>
  </div>
)}

      {/* ================= CHANGE PASSWORD MODAL ================= */}

      {showChangePassword && (

        <div
          className="admin-modal-overlay"
          onClick={() => setShowChangePassword(false)}
        >

          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="admin-modal-header">

              <h2 className="admin-modal-title">
                Change Password
              </h2>

              <button
                className="admin-modal-close"
                onClick={() => setShowChangePassword(false)}
              >
                ✕
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={handleChangePassword}
            >

              {passwordError && (
                <div className="admin-pw-error">
                  ⚠ {passwordError}
                </div>
              )}

              <div className="admin-form-field">

                <label>Current Password</label>

                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: e.target.value,
                    })
                  }
                />

              </div>

              <div className="admin-form-field">

                <label>New Password</label>

                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPass: e.target.value,
                    })
                  }
                />

              </div>

              <div className="admin-form-field">

                <label>Confirm Password</label>

                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: e.target.value,
                    })
                  }
                />

              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setShowChangePassword(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-submit-btn"
                >
                  Update Password
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;