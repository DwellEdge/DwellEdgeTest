import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://dwelledgetest.onrender.com",
  "https://dwelledge.github.io",
  "https://dwelledge.github.io/DwellEdgeTest",
];

app.use(
  cors({
    origin: allowedOrigins,
credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 5000; // 🔥 changed to 5000 to avoid conflict
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* ================= CHECK ENV ================= */
if (!process.env.ATLAS_URI) {
  console.error("❌ ATLAS_URI missing in .env file");
  process.exit(1);
}

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= SCHEMAS ================= */

// USER
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginHistory: [{ date: { type: Date, default: Date.now } }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

// CAREERS
const careerSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  requiredSkills: { type: String, default: "" },
  description: { type: String, default: "" },
  department: { type: String, default: "" },
  location: { type: String, default: "" },
  type: { type: String, default: "Full-time" },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Number, default: 1 },
  createdDate: { type: Date, default: Date.now },
});

const Career = mongoose.model("Career", careerSchema);
// APPLICATIONS
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Career",
  },

  jobTitle: {
    type: String,
    default: "N/A",
  },

  firstName: String,
  lastName: String,
  mobileNumber: String,
  emailId: String,

  primarySkills: String,
  secondarySkills: String,

  totalExperience: Number,
  relevantExperience: Number,

  resume: {
    data: String,
    contentType: String,
    fileName: String,
  },

  submittedDate: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model(
  "Application",
  applicationSchema,
  "careerApplications",
);

app.get("/api/applications", async (req, res) => {

  try {

    const applications = await Application.find()
      .populate("jobId")
      .sort({ submittedDate: -1 });

    console.log("APPLICATIONS:", applications);

    res.status(200).json(applications);

  } catch (err) {

    console.log("FETCH APPLICATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

/* ================= ROUTES ================= */

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

/* ================= AUTH ================= */

// ================= HELPERS =================

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i");

    const exists = await User.findOne({ email: emailRegex });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashed,
    });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i");

    const user = await User.findOne({ email: emailRegex });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CAREERS ================= */

// GET JOBS
app.get("/careers", async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdDate: -1 });

    console.log("📦 Jobs from DB:", jobs.length);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD JOB
app.post("/careers", async (req, res) => {
  try {
    const job = new Career(req.body);
    await job.save();

    res.json(job); // ✅ return full object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE JOB
app.delete("/careers/:id", async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE JOB
app.patch("/careers/:id", async (req, res) => {
  try {
    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= APPLICATION ================= */
app.post("/apply", upload.single("resume"), async (req, res) => {

  try {

    console.log("===== APPLY API HIT =====");

    console.log("BODY:", req.body);

    console.log("FILE:", req.file);

    const application = new Application({

      jobId: req.body.jobId || null,

      jobTitle: req.body.jobTitle || "N/A",

      firstName: req.body.firstName || "",

      lastName: req.body.lastName || "",

      mobileNumber: req.body.mobileNumber || "",

      emailId: req.body.emailId || "",

      primarySkills: req.body.primarySkills || "",

      secondarySkills: req.body.secondarySkills || "",

      totalExperience: Number(req.body.totalExperience) || 0,

      relevantExperience: Number(req.body.relevantExperience) || 0,

      resume: req.file
        ? {
            data: req.file.buffer.toString("base64"),
            contentType: req.file.mimetype,
            fileName: req.file.originalname,
          }
        : null,
    });

    await application.save();

    console.log("✅ Application Saved");

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });

  } catch (err) {

    console.log("❌ APPLY ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/applications/:id/resume", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application || !application.resume || !application.resume.data) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { data, contentType, fileName } = application.resume;

    const buffer = Buffer.from(data, "base64");

    // Force browser download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName || "resume.pdf"}"`,
    );
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (err) {
    console.log("RESUME DOWNLOAD ERROR:", err);
    return res.status(500).json({ message: "Download failed" });
  }
});

/* ================= DB TEST ================= */

app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("✅ DB Connected");
  } catch {
    res.send("❌ DB NOT Connected");
  }
});

app.post("/apply-test", async (req, res) => {
  try {
    console.log("===== APPLY TEST HIT =====");
    console.log(req.body);

    const {
      jobId,
      jobTitle,
      firstName,
      lastName,
      mobileNumber,
      emailId,
      primarySkills,
      secondarySkills,
      totalExperience,
      relevantExperience,
    } = req.body;

    const application = new Application({
      jobId,

      firstName,
      lastName,

      mobileNumber,
      emailId,

      primarySkills,
      secondarySkills,

      totalExperience: Number(totalExperience) || 0,
      relevantExperience: Number(relevantExperience) || 0,

      resume: "",
    });

    await application.save();

    console.log("✅ Saved to MongoDB");

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.log("❌ SAVE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*===================Employee=======*/
// 👨‍💼 EMPLOYEE MODEL
const employeeSchema = new mongoose.Schema({
  employee_code: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  mobile_number: String,
  email_id: String,
  date_of_birth: Date,
  date_of_joining: Date,
  designation: String,
  employment_type: String,
  work_location: String,
  status: { type: String, default: "Active" },
  date_of_exit: Date,
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema, "EmployeeDetails");

/* ================= EMPLOYEES ================= */

// GET all employees
// GET ALL EMPLOYEES
app.get("/api/employees", async (req, res) => {
  const data = await Employee.find();
  res.json(data);
});

// ADD EMPLOYEE
app.post("/api/employees", async (req, res) => {
  const emp = await Employee.create(req.body);
  res.json(emp);
});

// DELETE
app.delete("/api/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE employee
app.patch("/employees/:id", async (req, res) => {
  const emp = await Employee.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_date: new Date() },
    { new: true },
  );
  res.json(emp);
});

// 👨‍💼 FOUNDERS MODEL
const founderSchema = new mongoose.Schema({
  founder_id: String,
  founder_name: String,
  first_name: String,
  last_name: String,
  status: String,
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

const Founder = mongoose.model("Founder", founderSchema, "FounderDetails");

/* ================= FOUNDERS ================= */

// GET ALL
app.get("/api/founders", async (req, res) => {
  try {
    const founders = await Founder.find().sort({ created_date: -1 });
    res.json(founders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD
app.post("/api/founders", async (req, res) => {
  try {
    const founder = await Founder.create(req.body);
    res.json(founder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/founders/:id", async (req, res) => {
  try {
    await Founder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*=======Contactus========*/

app.post("/contact", async (req, res) => {

  try {

    console.log("BODY:", req.body);

    const {
      fullName,
      email,
      organization,
      mobile,
      country,
      jobTitle,
      message
    } = req.body;

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO || "triosntechies@gmail.com",
  subject: "New Contact Form Submission",
  html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2 style="color:#333;">New Contact Request</h2>

          <hr/>

          <p><b>Full Name:</b> ${fullName}</p>

          <p><b>Email:</b> ${email}</p>

          <p><b>Organization:</b> ${organization}</p>

          <p><b>Mobile:</b> ${mobile}</p>

          <p><b>Country:</b> ${country}</p>

          <p><b>Job Title:</b> ${jobTitle}</p>

          <h3>Message:</h3>

          <p>${message}</p>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent");

    res.status(200).json({
      success: true,
      message: "Email Sent Successfully"
    });

  } catch (err) {

    console.log("❌ EMAIL ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Email Failed"
    });

  }

});

/* ================= START SERVER ================= */

// 🔥 HANDLE PORT IN USE ERROR
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Port ${PORT} already in use. Try another port.`);
  } else {
    console.log("❌ Server Error:", err);
  }
});
