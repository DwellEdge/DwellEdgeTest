import React, { useState } from "react";
import Navbar from "./Navbar";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

function ApplyJob() {
    const location = useLocation();
    const job = location.state;

    const [user, setUser] = useState({
        jobId: job?._id || ""
    });

    const [errors, setErrors] = useState({
        emailId: "",
        mobileNumber: ""
    });

    console.log("JOB DATA:", job);

    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        // FINAL VALIDATION BEFORE SUBMIT

        const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(user.emailId || "")) {
            alert("Please enter valid Gmail address");
            return;
        }

        if (!/^\d{10}$/.test(user.mobileNumber || "")) {
            alert("Mobile number must be exactly 10 digits");
            return;
        }

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

            const res = await fetch(`${API}/apply`, {
                method: "POST",
                body: formData
            });

            const text = await res.text();

            console.log("RAW RESPONSE:", text);

            const data = text ? JSON.parse(text) : {};

            if (res.ok) {

                // CLEAR FORM
                setUser({
                    jobId: job?._id || "",
                    firstName: "",
                    lastName: "",
                    emailId: "",
                    mobileNumber: "",
                    primarySkills: "",
                    secondarySkills: "",
                    totalExperience: "",
                    relevantExperience: "",
                    resume: ""
                });

                // CLEAR FILE NAME
                setFileName("");

                // CLEAR ERRORS
                setErrors({
                    emailId: "",
                    mobileNumber: ""
                });

                // SUCCESS POPUP
                alert("Application Submitted Successfully ✅");
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
                        <input name="firstName" placeholder="First Name" value={user.firstName || ""} onChange={handleChange} />
                        <input name="lastName" placeholder="Last Name" value={user.lastName || ""} onChange={handleChange} />
                        <div>
                            <input
                                type="email"
                                name="emailId"
                                placeholder="example@gmail.com"
                                value={user.emailId || ""}
                                onChange={handleChange}
                            />

                            {errors.emailId && (
                                <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                                    {errors.emailId}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="mobileNumber"
                                placeholder="10 Digit Mobile Number"
                                maxLength="10"
                                value={user.mobileNumber || ""}
                                onChange={handleChange}
                            />

                            {errors.mobileNumber && (
                                <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                                    {errors.mobileNumber}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* WORK EXPERIENCE */}
                <section className="apply-card">
                    <h2>Work Experience</h2>

                    <div className="apply-grid">
                        <input name="primarySkills" placeholder="Primary Skills" value={user.primarySkills || ""} onChange={handleChange} />
                        <input name="secondarySkills" placeholder="Secondary Skills" value={user.secondarySkills || ""} onChange={handleChange} />
                        <input name="totalExperience" placeholder="Total Experience (years)" value={user.totalExperience || ""} onChange={handleChange} />
                        <input name="relevantExperience" placeholder="Relevant Experience (years)" value={user.relevantExperience || ""} onChange={handleChange} />

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