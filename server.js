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

const normalizeOrigin = (url) =>
  String(url || "")
    .trim()
    .replace(/\/$/, "");

const buildAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  const list = raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  const expanded = new Set(list);
  for (const origin of list) {
    try {
      const parsed = new URL(origin);
      if (parsed.hostname.startsWith("www.")) {
        expanded.add(`${parsed.protocol}//${parsed.hostname.slice(4)}`);
      } else if (parsed.hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)) {
        expanded.add(`${parsed.protocol}//www.${parsed.hostname}`);
      }
    } catch {
      /* ignore invalid */
    }
  }
  return [...expanded];
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    // Same-origin / server-to-server / Postman (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(", ")}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const warnMissingEnv = () => {
  const required = ["JWT_SECRET", "DB_NAME", "DB_USER"];
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

    // SMTP failure must never block API boot
    try {
      await initMailer();
    } catch (mailErr) {
      console.warn("[Mailer] skipped:", mailErr.message);
    }

    const { sequelize } = require("./models");
    try {
      await seedCourses();
      await seedAdmin();
    } catch (seedErr) {
      console.warn("[Seed] failed — creating tables via sync, then retrying seed.");
      console.warn("[Seed] reason:", seedErr.message);
      await sequelize.sync();
      console.log("[DB] Tables synced from models");
      await seedCourses();
      await seedAdmin();
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
