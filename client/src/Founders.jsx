import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

function Founders() {
    const [founders, setFounders] = useState([]);
    const navigate = useNavigate();

    const storedEmail = localStorage.getItem("adminEmail");

    const adminEmail =
        storedEmail && storedEmail !== "undefined"
            ? storedEmail
            : "admin@dwelledge.com";

    // 🔥 FETCH DATA
    useEffect(() => {
        fetch(`${API}/api/founders`)
            .then((res) => res.json())
            .then((data) => {
                console.log("FOUNDERS:", data);
                setFounders(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err));
    }, []);

    // 🗑 DELETE
    const handleDelete = async (id) => {
        await fetch(`${API}/api/founders/${id}`, { method: "DELETE" });
        setFounders(founders.filter((f) => f._id !== id));
    };

    const [showProfile, setShowProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        navigate("/login");
    };

    return (
        <div className="admin-page">

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

            {/* ===== SIDEBAR ===== */}
            <aside className="admin-sidebar">

                {/* TOP SECTION */}
                <div>
                    <div className="admin-logo">
                        <span className="admin-logo-mark">D</span>
                        <div>
                            <div className="admin-logo-name">DWELLEDGE</div>
                            <div className="admin-logo-sub">Admin Panel</div>
                        </div>
                    </div>

                    <div className="admin-nav">
                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/JobListing" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/JobListing")}
                        >
                            💼 Job Listings
                        </div>

                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/employeepage" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/employeepage")}
                        >
                            👨‍💼 Employees
                        </div>

                        <div
                            className={`admin-nav-item ${window.location.pathname.toLowerCase() === "/admin/founders"
                                    ? "admin-nav-active"
                                    : ""
                                }`}
                            onClick={() => navigate("/admin/founders")}
                        >
                            🏢 Founders
                        </div>                   <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/Applicants" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/Applicants")}
                        >
                            📄 Applications
                        </div>                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div>
                    <div
                        className="admin-user-card"
                        onClick={() => setShowProfile(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="admin-user-avatar">
                            {adminEmail?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="admin-user-email">{adminEmail}</div>
                            <div className="admin-user-role">Administrator</div>
                        </div>
                        <span className="admin-profile-arrow">›</span>
                    </div>

                    <button className="admin-logout-btn" onClick={handleLogout}>
                        ↩ Logout
                    </button>
                </div>

            </aside>

            {showProfile && (
                <div className="admin-modal-overlay" onClick={() => setShowProfile(false)}>
                    <div
                        className="admin-modal admin-profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">My Profile</h2>
                            <button
                                className="admin-modal-close"
                                onClick={() => setShowProfile(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="admin-profile-body">
                            <div className="admin-profile-avatar">
                                {adminEmail.charAt(0).toUpperCase()}
                            </div>

                            <div className="admin-profile-email">{adminEmail}</div>
                            <div className="admin-profile-role">Administrator</div>

                            <div className="admin-profile-options">
                                <button className="admin-profile-option">
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

                                <button
                                    className="admin-profile-option admin-profile-option-danger"
                                    onClick={handleLogout}
                                >
                                    <span className="admin-profile-option-icon">↩</span>
                                    <div>
                                        <div className="admin-profile-option-title">Logout</div>
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

            {/* ===== MAIN ===== */}
            <main main className="admin-main" >
                {/* Back to Dashboard Button */}
                <button
                    className="admin-back-btn"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Dashboard
                </button>

                <div className="admin-header">
                    <div>
                        <p className="admin-header-eyebrow">FOUNDERS</p>
                        <h1 className="admin-header-title">Founders Management</h1>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    <h2 className="admin-table-title">All Founders</h2>

                    {founders.length === 0 ? (
                        <div className="admin-empty">
                            <p>No founders found</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Founder ID</th>
                                    <th>Founder Name</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {founders.map((f) => (
                                    <tr key={f._id}>
                                        <td>{f._id?.slice(-5)}</td>
                                        <td>{f.founder_id}</td>
                                        <td>{f.founder_name}</td>
                                        <td>{f.first_name}</td>
                                        <td>{f.last_name}</td>
                                        <td>{f.status}</td>
                                        <td>{f.created_date?.slice(0, 10)}</td>
                                        <td>{f.updated_date?.slice(0, 10)}</td>

                                        <td>
                                            <button
                                                className="admin-delete-btn"
                                                onClick={() => handleDelete(f._id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div >
    );
}

export default Founders;