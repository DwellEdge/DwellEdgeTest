import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./innerpages.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminEmail", data.email || email);
      window.dispatchEvent(new Event("storage"));
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-circle login-bg-circle-1" />
      <div className="login-bg-circle login-bg-circle-2" />
      <div className="login-bg-letter">D</div>

      <Link to="/" className="login-back-link">
        ← Back to Home
      </Link>

      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <h1 className="login-brand-name">DWELLEDGE</h1>
            <p className="login-brand-tagline">Employee Portal</p>
          </div>

          <div className="login-left-content">
            <h2 className="login-left-title">
              Welcome <em>back</em> to your workspace
            </h2>
            <p className="login-left-sub">
              Manage job opportunities, track applications, and grow the team from one powerful dashboard.
            </p>

            <div className="login-features">
              {["Manage job listings", "Add & remove opportunities", "Track open positions"].map((f, i) => (
                <div className="login-feature-item" key={i}>
                  <span className="login-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="login-left-footer">
            © 2024 DWELLEDGE Tech. All rights reserved.
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <p className="login-eyebrow">EMPLOYEE ACCESS</p>
              <h2 className="login-form-title">Sign In</h2>
              <p className="login-form-sub">Enter your credentials to access the admin dashboard</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">✉</span>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="you@dwelledge.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    type="password"
                    className="login-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="login-error">
                  ⚠ {error}
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>Sign In <span className="login-btn-arrow">→</span></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;