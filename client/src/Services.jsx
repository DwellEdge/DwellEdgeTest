import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./innerpages.css";

const services = [
  {
    id: "enterprise-application-development",
    title: "Enterprise Application Development",
    description: "Building scalable, secure, and customized enterprise solutions to streamline business operations.",
    icon: "🏢",
  },
  {
    id: "application-support-maintenance",
    title: "Application Support & Maintenance",
    description: "Ensuring smooth performance, bug fixes, and ongoing support for mission-critical applications.",
    icon: "🛠️",
  },
  {
    id: "web-application-development",
    title: "Web Application Development",
    description: "Creating responsive, user-friendly web apps tailored to client needs.",
    icon: "🌍",
  },
  {
    id: "windows-application-development",
    title: "Windows Application Development",
    description: "Designing and deploying robust desktop applications for Windows environments.",
    icon: "🪟",
  },
  {
    id: "healthcare-domain-solutions",
    title: "Healthcare Domain Solutions",
    description: "Developing specialized applications for healthcare providers.",
    icon: "🏥",
  },
  {
    id: "ecommerce-application-development",
    title: "e-Commerce Application Development",
    description: "Building scalable online shopping platforms.",
    icon: "🛒",
  },
  {
    id: "hotel-hospitality-applications",
    title: "Hotel & Hospitality Applications",
    description: "Solutions for booking and hospitality management.",
    icon: "🏨",
  },
];

function Services() {
  return (
    <div className="services-page">
      <Navbar />

      
      <div style={{ paddingTop: "120px" }}>
        
        <div className="services-header">
          <h1 className="services-title">Our <em>Services</em></h1>
        </div>

        <div className="services-wrapper">
          
          <div className="services-row-4">
            {services.slice(0, 4).map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <span>{service.icon}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="services-row-3">
            {services.slice(4).map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <span>{service.icon}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Services;