import {  Routes, Route } from "react-router-dom";

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
import { api } from "./api";

function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
    </Router>
  );
}

export default App;