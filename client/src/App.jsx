import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import Careers from "./Careers";
import ApplyJob from "./ApplyJob";
import ContactUsPage from "./ContactUs";
import About from "./About";
import Login from "./EmployeeLogin";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";
import Services from "./Services";
import ServiceData from "./ServiceData";
import JobListing from "./JobListing";
import EmployeePage from "./EmployeePage";
import Founders from "./Founders";
import Applicants from "./Applicants";
import ScrollToTop from "./ScrollToTop";


function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
    <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/apply" element={<ApplyJob />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceData />} />
        <Route path="/admin/JobListing" element={<JobListing/>}/>
        <Route path="/admin/employeepage" element={<EmployeePage />} />
        <Route path="/admin/founders" element={<Founders />} />
        <Route path="/admin/Applicants" element={<Applicants />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;