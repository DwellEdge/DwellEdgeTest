import { motion } from "framer-motion";
import { useEffect } from "react";
import "./innerpages.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

import Abtimg1 from "./images/whoweare.jpeg";
import Abtimg2 from "./images/mission.jpeg";
import Abtimg3 from "./images/expertise.jpeg";
import Abtimg4 from "./images/values.jpeg";

const About = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, .reveal-left');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    const nav = document.querySelector('.navbar');
    const handler = () => {
      nav?.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', handler);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <div className="about-page">

      <Navbar />

      {/* HERO SECTION */}
      <div className="about-hero">
        <motion.p
          className="about-hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.p>

        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          built for<em>bold</em><br />businesses
        </motion.h1>

        <motion.p
          className="about-tagline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Empowering Talent Transformations
        </motion.p>
      </div>

      <div className="about-divider"></div>

      {/* MAIN CONTENT */}
      <div className="about-content">

        {/* WHO WE ARE */}
        <section className="about-section about-flex">
          <div className="about-image-wrapper">
            <img src={Abtimg1} alt="Who We Are" className="about-image" />
          </div>
          <div className="about-text">
            <h2 className="about-section-title">Who We Are</h2>
            <p className="about-description">
              DwellEdge is a forward-thinking technology company specializing in application development across diverse domains.
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section className="about-section about-flex about-flex-reverse">
          <div className="about-text">
            <h2 className="about-section-title">Our Mission</h2>
            <p className="about-description">
              To empower businesses with innovative, reliable, and scalable digital solutions that drive growth and efficiency.
            </p>
          </div>
          <div className="about-image-wrapper">
            <img src={Abtimg2} alt="Our Mission" className="about-image" />
          </div>
        </section>

        {/* EXPERTISE */}
        <section className="about-section about-flex">
          <div className="about-image-wrapper">
            <img src={Abtimg3} alt="Our Expertise" className="about-image" />
          </div>
          <div className="about-text">
            <h2 className="about-section-title">Our Expertise</h2>
            <p className="about-description">
              With strong capabilities in enterprise systems, healthcare, e-commerce, and hospitality, we deliver tailored applications that meet industry-specific needs.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-section about-flex about-flex-reverse">
          <div className="about-text">
            <h2 className="about-section-title">Our Values</h2>
            <ul className="about-values">
              <li>Innovation: Evolving with technology trends.</li>
              <li>Quality: Delivering secure, user-friendly solutions.</li>
              <li>Customer Focus: Building long-term trust.</li>
            </ul>
          </div>
          <div className="about-image-wrapper">
            <img src={Abtimg4} alt="Our Values" className="about-image" />
          </div>
        </section>

      </div>

      
      <Footer />

    </div>
  );
};

export default About;