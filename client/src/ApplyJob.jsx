import React, { useState } from "react";
import Navbar from "./Navbar";
import "./style.css";
import { Link, useLocation } from "react-router-dom";

function ApplyJob() {
    const location = useLocation();   
    const job = location.state;

    const [user, setUser] = useState({
        jobId: job?._id || ""
    });

    console.log("JOB DATA:", job);

    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
  try {
    console.log("🚀 Sending:", user);

    const formData = new FormData();
    Object.keys(user).forEach(key => {
      if (key !== 'resume') {
        formData.append(key, user[key]);
      }
    });
    if (user.resume && typeof user.resume !== 'string') {
      formData.append('resume', user.resume);
    }

    const res = await fetch("http://localhost:5000/apply", {
      method: "POST",
      body: formData
    });

    const text = await res.text();   
    console.log("RAW RESPONSE:", text);

    const data = text ? JSON.parse(text) : {};

    if (res.ok) {
      alert("Application Submitted 🚀");
    } else {
      alert(data.error || "Error occurred");
    }

  } catch (err) {
    console.error("❌ Fetch Error:", err);
  }
};
    return (
        <div className="apply-page">

            <Navbar />

            <main className="apply-container">

                <h1 className="apply-title">Apply for {job?.jobTitle}</h1>

                {/* PERSONAL INFO */}
                <section className="apply-card">
                    <h2>Personal Information</h2>

                    <div className="apply-grid">
                        <input name="firstName" placeholder="First Name" onChange={handleChange} />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
                        <input name="emailId" placeholder="Email" onChange={handleChange} />
                        <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} />
                    </div>
                </section>

                {/* WORK EXPERIENCE */}
                <section className="apply-card">
                    <h2>Work Experience</h2>

                    <div className="apply-grid">
                        <input name="primarySkills" placeholder="Primary Skills" onChange={handleChange} />
                        <input name="secondarySkills" placeholder="Secondary Skills" onChange={handleChange} />
                        <input name="totalExperience" placeholder="Total Experience (years)" onChange={handleChange} />
                        <input name="relevantExperience" placeholder="Relevant Experience (years)" onChange={handleChange} />

                        <div className="full">
                            <label>Upload Resume</label>
                            <input
                                type="file"
                                className="file-input"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFileName(file?.name);
                                    setUser({ ...user, resume: file });
                                }}
                            />

                            {fileName && (
                                <p className="file-name">📄 {fileName}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ACTION BUTTONS */}
                <div className="apply-actions">

                    <Link to="/careers" className="back-btn">
                        ← Back to Careers
                    </Link>

                    <button className="primary-btn" onClick={handleSubmit}>
                        Submit Application 🚀
                    </button>

                </div>

            </main>
        </div>
    );
}

export default ApplyJob;