const path = require("path");
// Do not override Hostinger-injected vars (especially PORT). A hardcoded
// PORT=5000 in .env causes 403: "Access to this resource on the server is denied!"
require("dotenv").config({ path: path.resolve(__dirname, ".env"), override: false });

const express = require("express");
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
const { allowedOrigins, isAllowedOrigin } = require("./utils/corsOrigins");

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(", ")}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] ||
      "Content-Type,Authorization,X-Requested-With"
    );
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const warnMissingEnv = () => {
  const required = ["JWT_SECRET", "DB_NAME", "DB_USER"];
  const recommended = ["STRIPE_SECRET_KEY"];
  const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
  const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;

  if (!mailUser || !mailPass) {
    console.warn("[WARN] MAIL_USER / MAIL_PASS not set — emails will not send.");
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

    if (!PORT) {
      throw new Error("PORT is not set. Use .env locally, or let Hostinger inject PORT.");
    }

    const onListen = () => {
      console.log(`Server running on ${HOST || "port"}:${PORT}`);
    };
    if (HOST) app.listen(Number(PORT), HOST, onListen);
    else app.listen(Number(PORT), onListen);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

