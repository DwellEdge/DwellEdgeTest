import React, { useState } from "react";
import Navbar from "./Navbar";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./api";

function ApplyJob() {
    const location = useLocation();   
    const job = location.state;

    const [user, setUser] = useState({
        jobId: job?._id || "",
        firstName: "",
        lastName: "",
        emailId: "",
        mobileNumber: "",
        primarySkills: "",
        secondarySkills: "",
        totalExperience: "",
        relevantExperience: "",
        resume: null,
    });

    console.log("JOB DATA:", job);

    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.jobId) {
            alert("Unable to submit application: job information is missing.");
            return;
        }

        try {
            console.log("🚀 Sending:", user);

            const formData = new FormData();
            formData.append("jobId", user.jobId);
            formData.append("firstName", user.firstName.trim());
            formData.append("lastName", user.lastName.trim());
            formData.append("emailId", user.emailId.trim());
            formData.append("mobileNumber", user.mobileNumber.trim());
            formData.append("primarySkills", user.primarySkills.trim());
            formData.append("secondarySkills", user.secondarySkills.trim());
            formData.append("totalExperience", user.totalExperience.trim());
            formData.append("relevantExperience", user.relevantExperience.trim());

            if (user.resume) {
                formData.append("resume", user.resume);
            }

            const res = await fetch(`${API_BASE_URL}/apply`, {
                method: "POST",
                body: formData,
            });

            const text = await res.text();
            console.log("RAW RESPONSE:", text);

            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                alert("Application Submitted 🚀");
            } else {
                alert(data.message || data.error || "Error occurred");
            }
        } catch (err) {
            console.error("❌ Fetch Error:", err);
            alert("Failed to submit application. Please try again.");
        }
    };
    return (
        <div className="apply-page">

            <Navbar />

            <main className="apply-container">

                <h1 className="apply-title">Apply for {job?.jobTitle}</h1>

                <form className="apply-form" onSubmit={handleSubmit}>

                    {/* PERSONAL INFO */}
                    <section className="apply-card">
                        <h2>Personal Information</h2>

                        <div className="apply-grid">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            value={user.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="lastName"
                            placeholder="Last Name"
                            value={user.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="emailId"
                            placeholder="Email"
                            value={user.emailId}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="mobileNumber"
                            placeholder="Mobile Number"
                            value={user.mobileNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </section>

                {/* WORK EXPERIENCE */}
                <section className="apply-card">
                    <h2>Work Experience</h2>

                    <div className="apply-grid">
                        <input
                            name="primarySkills"
                            placeholder="Primary Skills"
                            value={user.primarySkills}
                            onChange={handleChange}
                        />
                        <input
                            name="secondarySkills"
                            placeholder="Secondary Skills"
                            value={user.secondarySkills}
                            onChange={handleChange}
                        />
                        <input
                            name="totalExperience"
                            placeholder="Total Experience (years)"
                            value={user.totalExperience}
                            onChange={handleChange}
                        />
                        <input
                            name="relevantExperience"
                            placeholder="Relevant Experience (years)"
                            value={user.relevantExperience}
                            onChange={handleChange}
                        />

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

                    <button type="submit" className="primary-btn">
                        Submit Application 🚀
                    </button>

                </div>

                </form>

            </main>
        </div>
    );
}

export default ApplyJob;