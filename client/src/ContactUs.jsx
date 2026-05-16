import React, { useState } from "react";
import Navbar from "./Navbar";
import "./style.css";
import { API_BASE_URL } from "./api";

const API = API_BASE_URL;

function ContactUsPage() {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        organization: "",
        mobile: "",
        country: "",
        jobTitle: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(`${API}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {

                alert("Message Sent Successfully 🚀");

                setFormData({
                    fullName: "",
                    email: "",
                    organization: "",
                    mobile: "",
                    country: "",
                    jobTitle: "",
                    message: ""
                });

            } else {
                alert(data.message);
            }

        } catch (err) {

            console.log(err);
            alert("Server Error");

        }
    };

    return (

        <div className="contact-page">

            <Navbar />

            <main className="contact-shell">

                <div className="contact-breadcrumbs">
                    <span>Home</span> › <span>Contact Us</span>
                </div>

                <h1>Contact <em>Us</em></h1>

                <p className="contact-intro">
                    To request more information about our products and services,
                    please complete the form below.
                </p>

                <div className="section-divider"/>

                <section className="contact-layout">

                    <form className="contact-form" onSubmit={handleSubmit}>

                        <div className="contact-grid">

                            <input
                                type="text"
                                placeholder="Full Name *"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                placeholder="Business Email Address *"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Organization / Institution"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                            />

                            <input
                                type="tel"
                                placeholder="Phone / Mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                            />

                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                <option value="">Country*</option>
                                <option>India</option>
                                <option>USA</option>
                            </select>

                            <select
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                            >
                                <option value="">Job Title*</option>
                                <option>Manager</option>
                                <option>Developer</option>
                            </select>

                        </div>

                        <textarea
                            rows="6"
                            placeholder="How can we help you? *"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <div className="file-upload">
                            <input type="file" />
                        </div>

                        <label className="agree-line">

                            <input type="checkbox" required />

                            <span>
                                I agree to Dwelledge's Privacy Policy
                            </span>

                        </label>

                        <button type="submit" className="submit-btn">
                            Submit →
                        </button>

                    </form>

                    <aside className="contact-sidebar">

                        <div className="hq-card">

                            <h2>International Headquarters</h2>

                            <p>
                                DWELLEDGE PRIVATE LIMITED |
                                #13, 14TH CROSS,
                                V.V. MOHALLA,
                                MYSORE-570002
                                <br />
                                triosntechies@gmail.com
                            </p>

                        </div>

                        <ul className="contact-links">
                            <li>Analyst inquiries</li>
                            <li>Investor inquiries</li>
                            <li>Partner inquiries</li>
                            <li>Security reports</li>
                            <li>Career seekers</li>
                        </ul>

                    </aside>

                </section>

            </main>

        </div>
    );
}

export default ContactUsPage;