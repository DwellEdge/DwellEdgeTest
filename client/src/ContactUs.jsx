import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./style.css";



function ContactUsPage() {
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

                    {/* FORM */}
                    <form className="contact-form">

                        <div className="contact-grid">
                            <input type="text" placeholder="Full Name *" />
                            <input type="email" placeholder="Business Email Address *" />
                            <input type="text" placeholder="Organization / Institution" />
                            <input type="tel" placeholder="Phone / Mobile" />

                            <select>
                                <option>Country*</option>
                                <option>India</option>
                                <option>USA</option>
                            </select>

                            <select>
                                <option>Job Title*</option>
                                <option>Manager</option>
                                <option>Developer</option>
                            </select>
                        </div>

                        <textarea rows="6" placeholder="How can we help you? *" />

                        {/* FILE */}
                        <div className="file-upload">
                            <input type="file" />
                        </div>

                        <label className="agree-line">
                            <input type="checkbox" />
                            <span>
                                I agree to Dwelledge's Privacy Policy
                            </span>
                        </label>

                        <button type="submit" className="submit-btn">
                            Submit →
                        </button>

                    </form>

                    {/*  SIDEBAR */}
                    <aside className="contact-sidebar">

                        <div className="hq-card">
                            <h2>International Headquarters</h2>
                            <p>
                                DWELLEDGE PRIVATE LIMITED | #13, 14TH CROSS, V.V. MOHALLA, MYSORE-570002 | <br />
                                "triosntechies@gmail.com"
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

            <Footer />

        </div>
    );
}

export default ContactUsPage;