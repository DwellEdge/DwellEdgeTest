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
              <li><Link to="/awards">Awards</Link></li>
              <li><Link to="/leadership">Leadership</Link></li>
              <li><Link to="/investors">Investors</Link></li>
              <li><Link to="/newsroom">Newsroom</Link></li>
              <li><Link to="/sustainability">Sustainability & Social Impact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/stories">Customer Stories</Link></li>
              <li><Link to="/assessment">Skills Readiness Assessment</Link></li>
              <li><Link to="/webinars">Webinars</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/leadercamps">Leadercamps</Link></li>
              <li><Link to="/release-calendar">DWELLEDGE Release Calendar</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>DWELLEDGE Platform</h4>
            <ul>
              <li><Link to="/platform">Meet DWELLEDGE Platform</Link></li>
              <li><Link to="/app">Download the DWELLEDGE App</Link></li>
              <li><Link to="/catalog">Explore Premium Content Catalog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Topics</h4>
            <ul>
              <li><Link to="/accreditation">Accreditation</Link></li>
              <li><Link to="/aspire">Aspire Journeys</Link></li>
              <li><Link to="/compliance">Compliance Courses</Link></li>
              <li><Link to="/federal">Federal</Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <img src={dwelledgeLogo} alt="DWELLEDGE Logo" className="footer-logo-img" />

        <div className="footer-links">
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Notice</Link>
          <Link to="/cookies">Cookie Preferences</Link>
        </div>

        <div className="language-select">
          <span>English</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;