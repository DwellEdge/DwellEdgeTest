import { api } from "./api";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import bgImage from "./images/career-image.jpg";
import "./style.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  /* FETCH JOBS */
  useEffect(() => {
  api.get("/careers")
    .then((res) => {
      const data = res.data;

      console.log("API DATA:", data);

      const activeJobs = Array.isArray(data)
        ? data.filter((j) => j.isActive !== false)
        : [];

      setJobs(activeJobs);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setJobs([]);
    });
}, []);

  /* SEARCH FILTER */
  const filteredJobs = jobs.filter((job) =>
    job.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      <Navbar />

      <div className="main-content">
        {/* HERO */}
        <div
          className="career-hero"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="overlay">
            <h1>Find Your <em>Dream</em> Job</h1>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search jobs by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button>→</button>
            </div>
          </div>
        </div>

        {/* JOB LIST */}
        <div className="jobs-container">
          <div className="job-list">

            {filteredJobs.length === 0 ? (
              <p style={{ color: "white" }}>No jobs found</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="job-card"
                  onClick={() => setSelectedJob(job)}
                >
                  <div>
                    <h2>{job.jobTitle} →</h2>

                    {/*  Skills */}
                    <p className="job-skills">
                      <strong>Skills:</strong> {job.requiredSkills || "Not specified"}
                    </p>

                    {/* Short description */}
                    <p className="job-short-desc">
                      {(job.description || "").substring(0, 100)}...
                    </p>
                  </div>

                  {/*  Extra info */}
                  <div className="job-meta">
                    <span>{job.department || "General"}</span>
                    <span>{job.location || "Remote"}</span>
                    <span>{job.type || "Full-time"}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FILTERS */}
          <div className="filters">
            <h3>Filters</h3>

            <div className="filter-section">
              <p>Experience Level</p>
              <label><input type="checkbox" /> Fresher</label>
              <label><input type="checkbox" /> Experienced</label>
            </div>
          </div>
        </div>
      </div>

      {/*  JOB POPUP */}
      {selectedJob && (
        <div
          className="job-popup-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>{selectedJob.jobTitle}</h1>

            {/* META */}
            <div className="job-meta">
              <span>📍 {selectedJob.location || "Remote"}</span>
              <span>🏢 {selectedJob.department || "General"}</span>
              <span>💼 {selectedJob.type || "Full-time"}</span>
            </div>

            <div className="job-popup-content">

              <h2>Job Title</h2>
              <p>{selectedJob.jobTitle}</p>

              <h2>Required Skills</h2>
              <p>{selectedJob.requiredSkills || "Not specified"}</p>

              <h2>Job Description</h2>
              <p>{selectedJob.description}</p>

              <h2>Department</h2>
              <p>{selectedJob.department || "Not specified"}</p>

              <h2>Location</h2>
              <p>{selectedJob.location || "Not specified"}</p>

              <h2>Job Type</h2>
              <p>{selectedJob.type || "Full-time"}</p>

            </div>

            {/* APPLY BUTTON */}
            <div className="popup-actions">
              <button
                className="apply-btn"
                onClick={() =>
                  navigate("/apply", { state: selectedJob })
                }
              >
                Apply →
              </button>
            </div>

            <span
              className="close-btn"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Careers;