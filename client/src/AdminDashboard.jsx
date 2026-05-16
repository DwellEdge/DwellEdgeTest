import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

const dashboardItems = [
  {
    id: "JobListing",
    title: "Job Listings",
    description: "Building scalable, secure, and customized enterprise solutions to streamline business operations.",
  },
  {
    id: "EmployeePage",
    title: "Employee Dashboard",
    description: "Ensuring smooth performance, bug fixes, and ongoing support for mission-critical applications.",
  },
  {
    id: "Founders",
    title: "Founders Dashboard",
    description: "Creating responsive, user-friendly web apps tailored to client needs.",
  },
  {
    id: "Applicants",
    title: "Applicants",
    description: "View and manage job applications submitted by candidates.",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const storedEmail = localStorage.getItem("adminEmail");
  const adminEmail =
    storedEmail && storedEmail !== "undefined"
      ? storedEmail
      : "admin@dwelledge.com";


       useEffect(() => {
          const close = () => setShowDropdown(false);
          if (showDropdown) document.addEventListener("click", close);
          return () => document.removeEventListener("click", close);
        }, [showDropdown]);

        const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${API}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPass,
        }),
      });
      if (!res.ok) throw new Error("Incorrect current password");
      showToast("Password changed successfully");
      setShowChangePassword(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* ===== ADMIN NAVBAR ===== */}
            <header className="admin-topnav">
              <div className="admin-topnav-logo">
               <Link to="/"><img src={dwelledgeLogo} alt="Dwelledge" className="admin-topnav-logo-img" /></Link>
                <span className="admin-topnav-logo-text"><Link to="/">DWELLEDGE</Link></span>
              </div>
      
              <nav className="admin-topnav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/contact">Contact</Link>
              </nav>
      
              <div className="admin-topnav-profile" onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}>
                <div className="admin-topnav-avatar">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <span className="admin-topnav-caret">{showDropdown ? "▲" : "▼"}</span>
      
                {showDropdown && (
                  <div className="admin-topnav-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="admin-dropdown-header">
                      <div className="admin-dropdown-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="admin-dropdown-email">{adminEmail}</div>
                        <div className="admin-dropdown-role">Administrator</div>
                      </div>
                    </div>
                    <hr className="admin-dropdown-divider" />
                    <button className="admin-dropdown-item" onClick={() => { setShowDropdown(false); setShowProfile(true); }}>
                      👤 My Profile
                    </button>
                    <button className="admin-dropdown-item" onClick={() => { setShowDropdown(false); setShowChangePassword(true); }}>
                      🔒 Change Password
                    </button>
                    <hr className="admin-dropdown-divider" />
                    <button className="admin-dropdown-item admin-dropdown-logout" onClick={handleLogout}>
                      ↩ Logout
                    </button>
                  </div>
                )}
              </div>
            </header>

      <div style={{ paddingTop: "120px" }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <em>Dashboard</em>
          </h1>
        </div>

        <div className="dashboard-wrapper">
          <div className="dashboard-row">
            {dashboardItems.map((item) => (
              <Link
                to={`/admin/${item.id}`}
                key={item.id}
                className="dashboard-card-link"
              >
                <div className="dashboard-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;