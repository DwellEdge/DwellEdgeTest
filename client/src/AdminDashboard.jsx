import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const dashboardItems = [  
  {
    id: "JobListing",
    title: "Job Listings",
    description: "Building scalable, secure, and customized enterprise solutions to streamline business operations.",
  },
  {
    id: "EmployeePage",
    title: "Employee Dashboard",
    description: "Ensuring smooth performance, bug fixes, and ongoing support for mission-critical applications.",
  },
  {
    id: "Founders",
    title: "Founders Dashboard",
    description: "Creating responsive, user-friendly web apps tailored to client needs.",
  },
  {
    id: "Applicants",
    title: "Applicants",
    description: "View and manage job applications submitted by candidates.",
  },
];

function AdminDashboard() {
  return (
    <div className="dashboard-page">
      <Navbar />

      <div style={{ paddingTop: "120px" }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <em>Dashboard</em>
          </h1>
        </div>

        <div className="dashboard-wrapper">
          <div className="dashboard-row">
            {dashboardItems.map((item) => (
              <Link
                to={`/admin/${item.id}`}
                key={item.id}
                className="dashboard-card-link"
              >
                <div className="dashboard-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;