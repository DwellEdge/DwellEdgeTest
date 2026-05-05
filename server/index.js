import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 5001; // 🔥 changed to 5001 to avoid conflict
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* ================= CHECK ENV ================= */
if (!process.env.ATLAS_URI) {
  console.error("❌ ATLAS_URI missing in .env file");
  process.exit(1);
}

/* ================= DB CONNECT ================= */
mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch(err => {
    console.log("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= SCHEMAS ================= */

// USER
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginHistory: [{ date: { type: Date, default: Date.now } }]
}, { timestamps: true });

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
  createdDate: { type: Date, default: Date.now }
});

const Career = mongoose.model("Career", careerSchema, "careersCollection");

// APPLICATIONS
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
  firstName: String,
  lastName: String,
  mobileNumber: String,
  emailId: String,
  primarySkills: String,
  secondarySkills: String,
  totalExperience: Number,
  relevantExperience: Number,
  resume: String,
  submittedDate: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema, "CareerApplications");

/* ================= ROUTES ================= */

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

/* ================= AUTH ================= */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

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
    const updated = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= APPLICATION ================= */

app.post("/apply", async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      jobId: new mongoose.Types.ObjectId(req.body.jobId)
    });

    await application.save();
    res.json({ message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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