import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

function JobListing() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({});

  const storedEmail = localStorage.getItem("adminEmail");
  const adminEmail =
    storedEmail && storedEmail !== "undefined"
      ? storedEmail
      : "admin@dwelledge.com";

  const emptyForm = {
    title: "", department: "", location: "",
    type: "Full-time", description: "", requirements: ""
  };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    const close = () => setShowDropdown(false);
    if (showDropdown) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDropdown]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/careers`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newJob = {
        jobTitle: form.title,
        requiredSkills: form.requirements,
        description: form.description,
        department: form.department,
        location: form.location,
        type: form.type,
        isActive: true
      };
      const res = await fetch(`${API}/careers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
      });
      if (!res.ok) throw new Error("Failed to add job");
      showToast("Job added successfully");
      setShowForm(false);
      setForm(emptyForm);
      fetchJobs();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEditClick = (job) => {
    setEditJob(job);
    setEditForm({
      title: job.jobTitle || "",
      department: job.department || "",
      location: job.location || "",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: job.requiredSkills || "",
      isActive: job.isActive !== false,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/careers/${editJob._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: editForm.title,
          requiredSkills: editForm.requirements,
          description: editForm.description,
          department: editForm.department,
          location: editForm.location,
          type: editForm.type,
          isActive: editForm.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      showToast("Job updated successfully");
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/careers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setJobs(jobs.filter((j) => j._id !== id));
      setDeleteConfirm(null);
      showToast("Job deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleToggle = async (id) => {
    const job = jobs.find((j) => j._id === id);
    try {
      const res = await fetch(`${API}/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !job.isActive })
      });
      const updated = await res.json();
      setJobs(jobs.map((j) => (j._id === id ? updated : j)));
      showToast("Status updated");
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

  const activeJobs = jobs.filter((j) => j.isActive).length;

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

      {/* ===== TOAST ===== */}
      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : ""}`}>
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}



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


      <main className="admin-main">

        {/* Back to Dashboard Button */}
        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        <div className="admin-header">
          <div>
            <p className="admin-header-eyebrow">LISTS OF JOBS</p>
            <h1 className="admin-header-title">Job Opportunities</h1>
          </div>
          <button className="admin-add-btn" onClick={() => setShowForm(true)}>
            + Add New Job
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>
            <div className="admin-stat-value">{jobs.length}</div>
            <div className="admin-stat-label">Total Jobs</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-value">{activeJobs}</div>
            <div className="admin-stat-label">Active</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏸</div>
            <div className="admin-stat-value">{jobs.length - activeJobs}</div>
            <div className="admin-stat-label">Inactive</div>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h2 className="admin-table-title">All Listings</h2>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner" />
              Loading...
            </div>
          ) : jobs.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">💼</div>
              <p>No jobs listed yet. Click "+ Add New Job" to get started.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className={!job.isActive ? "admin-row-inactive" : ""}>
                    <td>
                      <div className="admin-job-title">{job.jobTitle}</div>
                      <div className="admin-job-desc">{job.department}</div>
                    </td>
                    <td><span className="admin-dept-tag">{job.department}</span></td>
                    <td>{job.location}</td>
                    <td><span className="admin-type-tag">{job.type}</span></td>
                    <td>
                      <button
                        className={`admin-status-btn ${job.isActive ? "active" : "inactive"}`}
                        onClick={() => handleToggle(job._id)}
                      >
                        {job.isActive ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td>
                      <button className="admin-edit-btn" onClick={() => handleEditClick(job)}>
                        ✏ Edit
                      </button>
                      <button className="admin-delete-btn" onClick={() => setDeleteConfirm(job._id)}>
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

      {/* ===== ADD JOB MODAL ===== */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Add New Job</h2>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleAdd}>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Job Title</label>
                  <input required placeholder="e.g. Frontend Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="admin-form-field">
                  <label>Department</label>
                  <input required placeholder="e.g. Engineering" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Location</label>
                  <input required placeholder="e.g. Remote / Hyderabad" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="admin-form-field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-field">
                <label>Description</label>
                <textarea rows={3} required placeholder="Job description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-form-field">
                <label>Requirements <span>(comma separated)</span></label>
                <textarea rows={2} placeholder="React, Node.js, MongoDB..." value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-submit-btn">Add Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT JOB MODAL ===== */}
      {editJob && (
        <div className="admin-modal-overlay" onClick={() => setEditJob(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Edit Job</h2>
              <button className="admin-modal-close" onClick={() => setEditJob(null)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleEdit}>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Job Title</label>
                  <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                </div>
                <div className="admin-form-field">
                  <label>Department</label>
                  <input required value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Location</label>
                  <input required value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                </div>
                <div className="admin-form-field">
                  <label>Type</label>
                  <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Status</label>
                  <select value={editForm.isActive ? "Active" : "Inactive"} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "Active" })}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-field">
                <label>Description</label>
                <textarea rows={3} required value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div className="admin-form-field">
                <label>Requirements <span>(comma separated)</span></label>
                <textarea rows={2} value={editForm.requirements} onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setEditJob(null)}>Cancel</button>
                <button type="submit" className="admin-submit-btn">Save Changes</button>
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
            <div className="admin-delete-title">Delete Job?</div>
            <div className="admin-delete-sub">This action cannot be undone.</div>
            <div className="admin-form-actions" style={{ justifyContent: "center" }}>
              <button className="admin-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-confirm-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
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
                <input type="password" required value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
              </div>
              <div className="admin-form-field">
                <label>New Password</label>
                <input type="password" required value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} />
              </div>
              <div className="admin-form-field">
                <label>Confirm New Password</label>
                <input type="password" required value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
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

export default JobListing;