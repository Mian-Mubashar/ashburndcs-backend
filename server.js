require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const careerRoutes = require("./routes/career");
const enrollmentRoutes = require("./routes/enrollment");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const seedCourses = require("./config/seedCourses");
const seedAdmin = require("./config/seedAdmin");
const { initMailer } = require("./utils/mailer");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = process.env.FRONTEND_URL
  ? { origin: process.env.FRONTEND_URL.split(",").map((u) => u.trim()) }
  : {};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const warnMissingEnv = () => {
  const required = ["JWT_SECRET", "MONGODB_URI"];
  const recommended = ["SMTP_USER", "SMTP_PASS", "STRIPE_SECRET_KEY"];

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[WARN] SMTP not set — verification emails will NOT be delivered to Gmail.");
  }

  required.forEach((key) => {
    if (!process.env[key]) console.warn(`[WARN] Missing required env: ${key}`);
  });
  recommended.forEach((key) => {
    if (!process.env[key]) console.warn(`[WARN] Missing recommended env: ${key}`);
  });
};

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Ashburn DCS API" });
});

app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", careerRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", paymentRoutes);

const start = async () => {
  try {
    warnMissingEnv();
    await connectDB();
    await initMailer();
    await seedCourses();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
