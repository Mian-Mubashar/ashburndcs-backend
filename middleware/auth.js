const jwt = require("jsonwebtoken");
const { User } = require("../models");

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const isAdminUser = (user) =>
  user.role === "admin" || getAdminEmails().includes(user.email.toLowerCase());

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || !isAdminUser(req.user)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });
  if (isAdminUser(req.user)) return next();
  if (req.user.role === "student") return next();
  res.status(403).json({ error: "Student access required" });
};

module.exports = { protect, adminOnly, studentOnly, isAdminUser };
