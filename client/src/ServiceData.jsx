import { useParams, Link } from "react-router-dom";

const serviceData = {
  "enterprise-application-development": {
    title: "Enterprise Application Development",
    emoji: "🏢",
    tagline: "Scalable, secure solutions built for the enterprise",
    description: "We design and build customized enterprise-grade applications that streamline business operations, improve productivity, and scale with your organization.",
    features: ["Custom ERP & CRM development", "Microservices & API-first architecture", "Role-based access control & SSO", "Third-party system integrations", "High availability & disaster recovery", "Enterprise-grade security standards"],
    technologies: ["React", "Node.js", "MongoDB", "PostgreSQL", "Docker", "Kubernetes"],
  },
  "application-support-maintenance": {
    title: "Application Support & Maintenance",
    emoji: "🛠️",
    tagline: "Keeping your mission-critical apps running smoothly",
    description: "We provide comprehensive support and maintenance services to ensure your applications perform at their best.",
    features: ["24/7 monitoring & incident response", "Bug tracking & resolution", "Performance tuning & optimization", "Version upgrades & patches", "SLA-based support packages", "Detailed reporting & analytics"],
    technologies: ["JIRA", "New Relic", "Datadog", "PagerDuty", "Grafana", "Sentry"],
  },
  "web-application-development": {
    title: "Web Application Development",
    emoji: "🌐",
    tagline: "Responsive, modern web apps tailored to your needs",
    description: "We create fast, responsive, and user-friendly web applications that deliver exceptional user experiences across all devices.",
    features: ["Single Page Applications (SPA)", "Full-stack MERN development", "REST & GraphQL APIs", "Authentication & authorization", "SEO optimization", "Progressive Web Apps (PWA)"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Next.js", "TypeScript"],
  },
  "windows-application-development": {
    title: "Windows Application Development",
    emoji: "🖥️",
    tagline: "Robust desktop software for Windows environments",
    description: "We design and deploy powerful Windows desktop applications that are intuitive, reliable, and built for performance.",
    features: ["WPF & WinForms development", ".NET & C# applications", "Offline-capable desktop apps", "Windows Service integration", "Hardware & peripheral support", "Installer & deployment packaging"],
    technologies: [".NET", "C#", "WPF", "WinForms", "SQL Server", "Azure"],
  },
  "healthcare-domain-solutions": {
    title: "Healthcare Domain Solutions",
    emoji: "🏥",
    tagline: "Technology built for better patient outcomes",
    description: "We develop specialized healthcare applications that meet strict compliance standards while improving patient care and clinical efficiency.",
    features: ["EHR / EMR system development", "HIPAA & HL7 compliance", "Telemedicine platforms", "Appointment & scheduling systems", "Medical billing integrations", "Patient portal development"],
    technologies: ["React", "Node.js", "FHIR", "HL7", "PostgreSQL", "AWS"],
  },
  "ecommerce-application-development": {
    title: "e-Commerce Application Development",
    emoji: "🛒",
    tagline: "Sell more with a powerful online store",
    description: "We build secure, high-performance e-commerce platforms that deliver seamless shopping experiences.",
    features: ["Custom storefront development", "Payment gateway integration", "Inventory & order management", "Multi-vendor marketplace support", "Cart abandonment & email flows", "Analytics & conversion tracking"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Razorpay", "Redis"],
  },
  "hotel-hospitality-applications": {
    title: "Hotel & Hospitality Applications",
    emoji: "🏨",
    tagline: "Elevate guest experiences with smart hospitality tech",
    description: "We craft tailored software solutions for the hospitality industry — from booking engines to loyalty programs and customer engagement tools.",
    features: ["Online booking & reservation systems", "Property management system (PMS)", "Channel manager integrations", "Guest loyalty & rewards programs", "Housekeeping & staff management", "Real-time availability & pricing"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Twilio", "Firebase"],
  },
};

function ServiceDetail() {
  const { serviceId } = useParams();
  const service = serviceData[serviceId];

  if (!service) {
    return (
      <div className="sd-not-found">
        <h2>Service not found</h2>
        <Link to="/services" className="sd-back-btn">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <div className="sd-hero">
        <Link to="/services" className="sd-back-link">← Back to Services</Link>
        <div className="sd-hero-icon">{service.emoji}</div>
        <h1 className="sd-hero-title">{service.title}</h1>
        <p className="sd-hero-tagline">{service.tagline}</p>
      </div>

      <div className="sd-body">
        <div className="sd-section">
          <h2 className="sd-section-title">Overview</h2>
          <p className="sd-description">{service.description}</p>
        </div>

        <div className="sd-section">
          <h2 className="sd-section-title">What We Offer</h2>
          <ul className="sd-features">
            {service.features.map((f, i) => (
              <li key={i} className="sd-feature-item">
                <span className="sd-check">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="sd-section">
          <h2 className="sd-section-title">Technologies</h2>
          <div className="sd-tech-tags">
            {service.technologies.map((tech, i) => (
              <span key={i} className="sd-tag">{tech}</span>
            ))}
          </div>
        </div>

        <div className="sd-cta">
          <h3 className="sd-cta-title">Ready to get started?</h3>
          <p className="sd-cta-sub">Let's talk about your project and see how we can help.</p>
          <Link to="/contact" className="sd-cta-btn">Contact Us →</Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;