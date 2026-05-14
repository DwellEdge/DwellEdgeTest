import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";

function Footer() {
  return (
    <footer className="footer fade-up">

      <div className="footer-top">

        <div className="footer-logo">
          <img src={dwelledgeLogo} alt="DWELLEDGE Logo" className="footer-logo-img" />
          <p>Where Skills Fuel Growth</p>

          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        <div className="footer-columns">

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li>Awards</li>
              <li>Leadership</li>
              <li>Investors</li>
              <li>Newsroom</li>
              <li>Sustainability & Social Impact</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>Blog</li>
              <li>Customer Stories</li>
              <li>Skills Readiness Assessment</li>
              <li>Webinars</li>
              <li>Events</li>
              <li>Leadercamps</li>
              <li>DWELLEDGE Release Calendar</li>
              <li>Support</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>DWELLEDGE Platform</h4>
            <ul>
              <li>Meet DWELLEDGE Platform</li>
              <li>Download the DWELLEDGE App</li>
              <li>Explore Premium Content Catalog</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Topics</h4>
            <ul>
              <li>Accreditation</li>
              <li>Aspire Journeys</li>
              <li>Compliance Courses</li>
              <li>Federal</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <img src={dwelledgeLogo} alt="DWELLEDGE Logo" className="footer-logo-img" />

        <div className="footer-links">
          <p>Accessibility</p>
          <p>Terms of Use</p>
         <p> Privacy Notice</p>
          <p>Cookie Preferences</p>
        </div>

        <div className="language-select">
          <span>English</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;