import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

// Hero slider videos (6 new)
import slide1 from "./vedioes/TechnologyAbstract.mp4";
import slide2 from "./vedioes/office.mp4";
import slide3 from "./vedioes/teaching.mp4";
import slide4 from "./vedioes/peoplecoding.mp4";
import slide5 from "./vedioes/keyboardtyping.mp4";
import slide6 from "./vedioes/falling blocks.mp4";

// Promo section videos 
import video1 from "./vedioes/ai-animation-video.mp4";
import video2 from "./vedioes/successful-marketing.mp4";

// Images
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
      title: "Building Blocks of Innovation",
      text: "We construct powerful digital foundations that help your business scale with confidence.",
    },
    {
      video: slide2,
      title: "Code That Powers Your Vision",
      text: "Our expert developers write clean, efficient code to bring your ideas to life.",
    },
    {
      video: slide3,
      title: "Innovative Digital Solutions",
      text: "We design scalable web, AI, and cloud solutions that accelerate business growth and efficiency.",
    },
    {
      video: slide4,
      title: "Empowering Talent Transformations",
      text: "Embrace the talent revolution and build future-ready skills with DWELLEDGE technologies.",
    },
    {
      video: slide5,
      title: "Upskill Your Talent with Us",
      text: "We provide training and mentorship programs to help your team grow with modern technology.",
    },
    {
      video: slide6,
      title: "Technology That Drives Success",
      text: "From startups to enterprises, DWELLEDGE delivers smart, reliable, and high-performance software solutions.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const heroVideoRef = useRef(null);
  const promo1Ref = useRef(null);
  const promo2Ref = useRef(null);
  const trackRef = useRef(null);

  // Play hero video every time slide changes
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.play().catch(() => { });
  }, [current]);

  // play promo videos on mount
  useEffect(() => {
    [promo1Ref, promo2Ref].forEach((ref) => {
      const v = ref.current;
      if (!v) return;
      v.play().catch(() => { });
    });
  }, []);

  // Play promo videos when scrolled into view
  useEffect(() => {
    const refs = [promo1Ref, promo2Ref];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.play().catch(() => { });
        });
      },
      { threshold: 0.1 }
    );
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Fade-up scroll observer + auto slide interval
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

  const scrollLeft = () =>
    trackRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    trackRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const [activeTab, setActiveTab] = useState(null);

  const tabData = [
    {
      key: "web", label: "Web Services", icon: "🌐",
      title: "Web Services", subtitle: "Clean, fast websites and web apps built to grow with you",
      points: [
        { icon: "🖥️", label: "Custom Web Apps", desc: "React & Node.js applications tailored to your business needs" },
        { icon: "📱", label: "Responsive Design", desc: "Mobile-friendly UIs that look sharp on every device" },
        { icon: "⚡", label: "Performance Focused", desc: "Fast-loading, SEO-ready sites built for real-world traffic" },
        { icon: "🔄", label: "Post-Launch Support", desc: "We stay with you after delivery — updates, fixes, and more" },
      ],
    },
    {
      key: "industry", label: "Industry Services", icon: "🏢",
      title: "Industry Services", subtitle: "Software solutions shaped around the domain you operate in",
      points: [
        { icon: "🏥", label: "Healthcare", desc: "Appointment systems, patient portals, and clinic management tools" },
        { icon: "🛒", label: "E-Commerce", desc: "Online stores with product management, payments, and order tracking" },
        { icon: "🏨", label: "Hospitality", desc: "Booking systems and management dashboards for hotels and hostels" },
        { icon: "🎓", label: "Education", desc: "Student portals, course platforms, and learning management systems" },
      ],
    },
    {
      key: "comm", label: "Communication", icon: "💬",
      title: "Communication", subtitle: "We keep you in the loop at every step of the project",
      points: [
        { icon: "🗓️", label: "Sprint-Based Delivery", desc: "Work broken into clear cycles with regular demos and check-ins" },
        { icon: "🎧", label: "Direct Team Access", desc: "Talk to the people actually building your product, not a middleman" },
        { icon: "📊", label: "Progress Updates", desc: "Regular reports covering what's done, what's next, and any blockers" },
        { icon: "🤝", label: "Discovery Call", desc: "We start with a free call to understand your goals before anything else" },
      ],
    },
    {
      key: "feature", label: "Feature Knowledge", icon: "⚙️",
      title: "Feature Knowledge", subtitle: "Technologies and capabilities we bring to every project",
      points: [
        { icon: "🤖", label: "AI Integration", desc: "We embed AI features into your product — recommendations, predictions, and more" },
        { icon: "☁️", label: "Cloud Deployment", desc: "Hosted on AWS or GCP with scalable infrastructure and CI/CD pipelines" },
        { icon: "🔌", label: "API Integrations", desc: "We connect your app to payment gateways, CRMs, maps, and other tools" },
        { icon: "🛡️", label: "Secure by Design", desc: "Built with OWASP standards, data encryption, and privacy best practices" },
      ],
    },
  ];

  return (
    <div className="homepage">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero-banner">
        {slides.map((slide, i) => (
          <video
            key={i}
            src={slide.video}
            muted
            playsInline
            loop
            autoPlay
            className={`hero-bg-video ${i === current ? "active" : ""}`}
          />
        ))}
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
          <div className="hero-dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`hero-dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY SECTION ===== */}
      <section className="video-bg-section" onMouseLeave={() => setActiveTab(null)}>
        <div className="section-overlay" />
        <div className="section-content fade-up">
          <h1>Launch faster with 16+ Agentforce solutions</h1>
          <div className="industry-grid">
            {tabData.map((tab) => (
              <div
                key={tab.key}
                className={`industry-box ${activeTab === tab.key ? "active" : ""}`}
                onMouseEnter={() => setActiveTab(tab.key)}
                onClick={() => setActiveTab(tab.key)}
              >
                <h3>{tab.label}</h3>
                {activeTab === tab.key && <div className="tab-arrow" />}
              </div>
            ))}
          </div>
          {activeTab && (
            <div className="industry-popup">
              <div className="popup-header">
                <span className="popup-icon">{tabData.find(t => t.key === activeTab)?.icon}</span>
                <div>
                  <h3>{tabData.find(t => t.key === activeTab)?.title}</h3>
                  <p>{tabData.find(t => t.key === activeTab)?.subtitle}</p>
                </div>
              </div>
              <div className="popup-points">
                {tabData.find(t => t.key === activeTab)?.points.map((pt, i) => (
                  <div className="popup-point" key={i}>
                    <span className="pt-icon">{pt.icon}</span>
                    <div>
                      <strong>{pt.label}</strong>
                      <span>{pt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO 1 ===== */}
      <section className="promo fade-up">
        <div className="promo-left">
          <h1>Got An Idea? Let's Build It Together.</h1>
          <p>
            We're a growing tech team that turns your vision into real,
            working software — web apps, platforms, and digital tools built
            from scratch, just for you.
          </p>
          <div className="promo-buttons">
            <Link to="/careers" className="cta-btn primary">Start a Project</Link>
            <Link to="/Services" className="cta-btn">See Our Work</Link>
          </div>
        </div>
        <div className="promo-right">
          <video
            ref={promo1Ref}
            src={video2}
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
          <h2>Built By A Team That Treats Your Project Like Their Own.</h2>
          <p>
            No bloated processes, no account managers in the middle. You work
            directly with the developers and designers building your product —
            fast communication, honest timelines, and real ownership.
          </p>
          <div className="promo-buttons">
            <Link to="/contact" className="cta-btn primary">Talk to Us</Link>
            <Link to="/about" className="cta-btn">Who We Are</Link>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CARDS ===== */}
      <section className="bottom-section fade-up">
        <h1 className="bottom-heading">Cutting Edge Solutions To Power Up Your Business.</h1>

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
        <h2 className="giftcard-heading">Popular Development</h2>

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