import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);


    const [showProfile, setShowProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);


    const [showForm, setShowForm] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const storedEmail = localStorage.getItem("adminEmail");
    const adminEmail =
        storedEmail && storedEmail !== "undefined"
            ? storedEmail
            : "admin@dwelledge.com";


    const activeEmployees = employees.filter((e) => e.status === "Active").length;

    const emptyForm = {
        employee_code: "",
        first_name: "",
        last_name: "",
        date_of_joining: "",
        email_id: "",
        mobile_number: "",
        department: "",
        designation: "",
        employment_type: "Full-time",
        work_location: "",
        date_of_birth: "",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const close = () => setShowDropdown(false);

        if (showDropdown) {
            document.addEventListener("click", close);
        }

        return () => document.removeEventListener("click", close);
    }, [showDropdown]);

    useEffect(() => {
        fetch(`${API}/api/employees`)
            .then((res) => res.json())
            .then((data) => {
                setEmployees(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // ADD EMPLOYEE
    const handleAdd = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(`${API}/api/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    employee_code: form.employee_code,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    date_of_joining: form.date_of_joining,
                    email_id: form.email_id,
                    mobile_number: form.mobile_number,
                    department: form.department,
                    designation: form.designation,
                    employment_type: form.employment_type,
                    work_location: form.work_location,
                    date_of_birth: form.date_of_birth,
                    status: form.status,
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add employee");
            }

            const newEmp = await res.json();

            setEmployees((prev) => [...prev, newEmp]);

            setShowForm(false);

            setForm(emptyForm);

            showToast("Employee added successfully");

        } catch (err) {

            showToast(err.message, "error");
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API}/api/employees/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setEmployees(employees.filter((e) => e._id !== id));
            setDeleteConfirm(null);
            showToast("Employee deleted");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

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
        <div className="admin-page">

            {/* ===== TOAST ===== */}
            {toast && (
                <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : ""}`}>
                    {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
                </div>
            )}

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
                            className={`admin-nav-item ${window.location.pathname === "/admin/founders" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/founders")}
                        >
                            🏢 Founders
                        </div>
                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/Applicants" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/Applicants")}
                        >
                            📄 Applications
                        </div>
                    </div>
                </div>
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

            {/* ===== MAIN ===== */}
            <main className="admin-main">
                <button className="admin-back-btn" onClick={() => navigate("/admin")}>
                    ← Back to Dashboard
                </button>

                <div className="admin-header">
                    <div>
                        <p className="admin-header-eyebrow">LIST OF EMPLOYEES</p>
                        <h1 className="admin-header-title">Employee Management</h1>
                    </div>
                    <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                        + Add Employee
                    </button>
                </div>

                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">📋</div>
                        <div className="admin-stat-value">{employees.length}</div>
                        <div className="admin-stat-label">Total No Of Employees</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">✅</div>
                        <div className="admin-stat-value">{activeEmployees}</div>
                        <div className="admin-stat-label">Active</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">⏸</div>
                        <div className="admin-stat-value">{employees.length - activeEmployees}</div>
                        <div className="admin-stat-label">Inactive</div>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    <h2 className="admin-table-title">All Employees</h2>

                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner" />
                            Loading...
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="admin-empty">
                            <p>No employees found</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>DOB</th>
                                    <th>DOJ</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Exit</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td>{emp.employee_code}</td>
                                        <td>{emp.first_name}</td>
                                        <td>{emp.last_name}</td>
                                        <td>{emp.email_id}</td>
                                        <td>{emp.mobile_number}</td>
                                        <td>{emp.date_of_birth?.slice(0, 10)}</td>
                                        <td>{emp.date_of_joining?.slice(0, 10)}</td>
                                        <td>{emp.department}</td>
                                        <td>{emp.designation}</td>
                                        <td>{emp.employment_type}</td>
                                        <td>{emp.work_location}</td>
                                        <td>{emp.status}</td>
                                        <td>{emp.date_of_exit?.slice(0, 10) || "-"}</td>
                                        <td>{emp.created_date?.slice(0, 10)}</td>
                                        <td>{emp.updated_date?.slice(0, 10)}</td>
                                        <td>
                                            <button
                                                className="admin-delete-btn"
                                                onClick={() => setDeleteConfirm(emp._id)}
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

            {/* ===== ADD EMPLOYEE MODAL ===== */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">Add New Employee</h2>
                            <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        <form className="admin-form" onSubmit={handleAdd}>
                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>Employee Code</label>
                                    <input
                                        required
                                        placeholder="e.g. EMP003"
                                        value={form.employee_code}
                                        onChange={(e) => setForm({ ...form, employee_code: e.target.value })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>First Name</label>
                                    <input
                                        required
                                        placeholder="First name"
                                        value={form.first_name}
                                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Last Name</label>
                                    <input
                                        required
                                        placeholder="Last name"
                                        value={form.last_name}
                                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Date of Joining</label>
                                    <input
                                        required
                                        type="date"
                                        value={form.date_of_joining}
                                        onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>Email ID</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@example.com"
                                        value={form.email_id}
                                        onChange={(e) => setForm({ ...form, email_id: e.target.value })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Mobile Number</label>
                                    <input
                                        required
                                        placeholder="10-digit mobile"
                                        value={form.mobile_number}
                                        onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>Department</label>
                                    <input
                                        required
                                        placeholder="e.g. Engineering"
                                        value={form.department}
                                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Designation</label>
                                    <input
                                        required
                                        placeholder="e.g. Software Engineer"
                                        value={form.designation}
                                        onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-field">
                                    <label>Employment Type</label>
                                    <select
                                        value={form.employment_type}
                                        onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Work Location</label>
                                    <input
                                        placeholder="e.g. Remote / Hyderabad"
                                        value={form.work_location}
                                        onChange={(e) => setForm({ ...form, work_location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-cancel-btn" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-submit-btn">
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== DELETE CONFIRM MODAL ===== */}
            {deleteConfirm && (
                <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-delete-icon">🗑</div>
                        <div className="admin-delete-title">Delete Employee?</div>
                        <div className="admin-delete-sub">This action cannot be undone.</div>
                        <div className="admin-form-actions" style={{ justifyContent: "center" }}>
                            <button className="admin-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="admin-confirm-delete-btn" onClick={() => handleDelete(deleteConfirm)}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PROFILE MODAL ===== */}
            {showProfile && (
                <div className="admin-modal-overlay" onClick={() => setShowProfile(false)}>
                    <div className="admin-modal admin-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">My Profile</h2>
                            <button className="admin-modal-close" onClick={() => setShowProfile(false)}>✕</button>
                        </div>
                        <div className="admin-profile-body">
                            <div className="admin-profile-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
                            <div className="admin-profile-email">{adminEmail}</div>
                            <div className="admin-profile-role">Administrator</div>
                            <div className="admin-profile-options">
                                <button className="admin-profile-option" onClick={() => { setShowProfile(false); setShowChangePassword(true); }}>
                                    <span className="admin-profile-option-icon">🔒</span>
                                    <div>
                                        <div className="admin-profile-option-title">Change Password</div>
                                        <div className="admin-profile-option-sub">Update your login password</div>
                                    </div>
                                    <span className="admin-profile-option-arrow">›</span>
                                </button>
                                <button className="admin-profile-option admin-profile-option-danger" onClick={handleLogout}>
                                    <span className="admin-profile-option-icon">↩</span>
                                    <div>
                                        <div className="admin-profile-option-title">Logout</div>
                                        <div className="admin-profile-option-sub">Sign out of admin panel</div>
                                    </div>
                                    <span className="admin-profile-option-arrow">›</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== CHANGE PASSWORD MODAL ===== */}
            {showChangePassword && (
                <div className="admin-modal-overlay" onClick={() => setShowChangePassword(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">Change Password</h2>
                            <button className="admin-modal-close" onClick={() => setShowChangePassword(false)}>✕</button>
                        </div>
                        <form className="admin-form" onSubmit={handleChangePassword}>
                            {passwordError && <div className="admin-pw-error">⚠ {passwordError}</div>}
                            <div className="admin-form-field">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-field">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.newPass}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-field">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-cancel-btn" onClick={() => setShowChangePassword(false)}>Cancel</button>
                                <button type="submit" className="admin-submit-btn">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default EmployeePage;