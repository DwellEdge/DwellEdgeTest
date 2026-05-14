import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
// ================= MULTER CONFIG =================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("https://dwelledge.github.io")
      ) {
        return callback(null, true);
      }
      callback(
        new Error(`CORS policy does not allow access from origin ${origin}`),
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());
app.use(express.json());

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

const Career = mongoose.model("Career", careerSchema, "careersCollection");

// APPLICATIONS
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Career",
    required: true,
  },
  firstName: String,
  lastName: String,
  mobileNumber: String,
  emailId: String,
  primarySkills: String,
  secondarySkills: String,
  totalExperience: Number,
  relevantExperience: Number,
  resume: String,
  submittedDate: { type: Date, default: Date.now },
});

const Application = mongoose.model(
  "Application",
  applicationSchema,
  "CareerApplications",
);

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
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const application = new Application({
      jobId: new mongoose.Types.ObjectId(req.body.jobId),

      firstName: req.body.firstName,
      lastName: req.body.lastName,

      mobileNumber: req.body.mobileNumber,

      emailId: req.body.emailId,

      primarySkills: req.body.primarySkills,

      secondarySkills: req.body.secondarySkills,

      totalExperience: req.body.totalExperience,

      relevantExperience: req.body.relevantExperience,

      resume: req.file ? req.file.filename : "",
    });

    await application.save();

    res.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// GET APPLICATIONS
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId")
      .sort({ submittedDate: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DOWNLOAD RESUME
app.get("/api/applications/:id/resume", async (req, res) => {
  try {
    const appData = await Application.findById(req.params.id);

    if (!appData || !appData.resume) {
      return res.status(404).send("Resume not found");
    }

    const filePath = `uploads/${appData.resume}`;

    res.download(filePath);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
