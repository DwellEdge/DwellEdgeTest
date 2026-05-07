import { api } from "./api";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

// 🎥 Videos
import video1 from "./vedioes/ai-animation-video.mp4";
import video3 from "./vedioes/backside-motion-poster.mp4";
import slide1 from "./vedioes/birds-vedio.mp4";

// 🖼️ Images
import image1 from "./images/buildings.png";
import image2 from "./images/design-building.png";
import image3 from "./images/nature-buildings.png";
import img1 from "./images/app-support-image.avif";
import img2 from "./images/ecommers-application.jpg";
import img3 from "./images/healthcare-domin-image.jpg";
import img4 from "./images/hospital-application.webp";
import img5 from "./images/hostal-application.jpg";
import img6 from "./images/webdegin-image.avif";

function Home() {
  const slides = [
    {
      video: slide1,
      title: "Technology That Drives Success",
      text: "From startups to enterprises, DWELLEDGE delivers smart, reliable, and high-performance software solutions.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const heroVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const promo1Ref = useRef(null);
  const promo2Ref = useRef(null);
  const trackRef = useRef(null);

  // Play hero video when slide changes
  useEffect(() => {
    const v = heroVideoRef.current;
    if (v) v.play().catch(() => { });
  }, [current]);

  // Force play background + promo videos on mount
  useEffect(() => {
    [bgVideoRef, promo1Ref, promo2Ref].forEach((ref) => {
      const v = ref.current;
      if (v) v.play().catch(() => { });
    });
  }, []);

  // Auto-play videos when scrolled into view
  useEffect(() => {
    const refs = [bgVideoRef, promo1Ref, promo2Ref];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.play().catch(() => { });
        });
      },
      { threshold: 0.1 }
    );
    refs.forEach((ref) => ref.current && observer.observe(ref.current));
    return () => refs.forEach((ref) => ref.current && observer.unobserve(ref.current));
  }, []);

  // Fade-up + auto slide
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => fadeObserver.observe(el));
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      elements.forEach((el) => fadeObserver.unobserve(el));
      clearInterval(interval);
    };
  }, [slides.length]);

  const scrollLeft = () => trackRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => trackRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="homepage">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero-banner">
        <video
          ref={heroVideoRef}
          src={slides[current].video}
          muted
          playsInline
          loop
          autoPlay
          className="hero-bg-video active"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1>{slides[current].title}</h1>
            <p>{slides[current].text}</p>
            <div className="hero-buttons">
              <Link to="/contact" className="cta-btn">Contact Us</Link>
              <Link to="/Services" className="cta-btn primary">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY / VIDEO BG SECTION ===== */}
      <section className="video-bg-section">
        <video
          ref={bgVideoRef}
          src={video3}
          muted
          playsInline
          loop
          autoPlay
          className="section-bg-video"
        />
        <div className="section-overlay" />
        <div className="section-content fade-up">
          <h1>Launch faster with 16+ Agentforce solutions</h1>
          <div className="industry-grid">
            <div className="industry-box"><h3>Web Services</h3></div>
            <div className="industry-box"><h3>Industry Services</h3></div>
            <div className="industry-box"><h3>Communication</h3></div>
            <div className="industry-box"><h3>Feature Aknowledge</h3></div>
          </div>
        </div>
      </section>

      {/* ===== PROMO 1 ===== */}
      <section className="promo fade-up">
        <div className="promo-left">
          <h1>Grow faster and work smarter.</h1>
          <p>Start with DWELLEDGE Suite – built for small business with AI to help you grow.</p>
          <div className="promo-buttons">
            <button className="cta-btn primary">Start for free</button>
            <button className="cta-btn">Start demo</button>
          </div>
        </div>
        <div className="promo-right">
          <video
            ref={promo1Ref}
            src={video3}  
            muted
            playsInline
            loop
            autoPlay
            className="promo-video"
          />
        </div>
      </section>

      {/* ===== PROMO 2 ===== */}
      <section className="promo alt fade-up">
        <div className="promo-left">
          <video
            ref={promo2Ref}
            src={video1}
            muted
            playsInline
            loop
            autoPlay
            className="promo-video"
          />
        </div>
        <div className="promo-right">
          <h2>3M+ conversations handled by DWELLEDGE AI</h2>
          <p>66% automation, higher conversions, and smarter AI solutions for business growth.</p>
          <div className="promo-buttons">
            <button className="cta-btn primary">See our stories</button>
            <button className="cta-btn">Experience Help</button>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CARDS ===== */}
      <section className="bottom-section fade-up">
        <h1 className="bottom-heading">Cutting edge solutions to power up your business.</h1>
        <div className="bottom-grid">
          <div className="bottom-card">
            <img src={image2} alt="Industries" />
            <h3>Industries</h3>
            <p>Select your industry. Discover our impact.</p>
            <span className="card-arrow">→</span>
          </div>
          <div className="bottom-card">
            <img src={image3} alt="Services" />
            <h3>Services</h3>
            <p>Experience our services. Transform your business.</p>
            <span className="card-arrow">→</span>
          </div>
          <div className="bottom-card">
            <img src={image1} alt="Products and Platforms" />
            <h3>Products and Platforms</h3>
            <p>Explore our products. Accelerate your performance.</p>
            <span className="card-arrow">→</span>
          </div>
        </div>
      </section>
      {/* ===== CAROUSEL ===== */}
      <section className="giftcard-section fade-up">
        <h2 className="giftcard-heading">Popular development</h2>
        <p className="giftcard-subheading">
          Explore our most popular development solutions, designed to help
          you achieve your goals faster and more efficiently.
        </p>
        <div className="giftcard-carousel">
          <button className="carousel-arrow left" onClick={scrollLeft}>‹</button>
          <div className="giftcard-track" ref={trackRef}>
            <div className="giftcard-box"><img src={img1} alt="App-support" /><h3>App Support</h3></div>
            <div className="giftcard-box"><img src={img2} alt="Ecommerce" /><h3>E-Commerce App</h3></div>
            <div className="giftcard-box"><img src={img3} alt="Healthcare" /><h3>Healthcare Domain</h3></div>
            <div className="giftcard-box"><img src={img4} alt="Hospital" /><h3>Hospital Application</h3></div>
            <div className="giftcard-box"><img src={img5} alt="Hostel" /><h3>Hostel Application</h3></div>
            <div className="giftcard-box"><img src={img6} alt="Webdesign" /><h3>Web Design</h3></div>
          </div>
          <button className="carousel-arrow right" onClick={scrollRight}>›</button>
        </div>
      </section>

      <Footer />

    </div>
  );
}

export default Home;