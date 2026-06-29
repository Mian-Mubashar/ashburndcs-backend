const User = require("../models/User");

const ADMIN_EMAIL = "admin@ashburn.com";
const ADMIN_PASSWORD = "Ashburn@123";

const seedAdmin = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

  if (existing) {
    existing.role = "admin";
    existing.isEmailVerified = true;
    existing.name = existing.name || "Admin";
    existing.password = ADMIN_PASSWORD;
    await existing.save();
    console.log("Admin user updated: admin@ashburn.com");
    return;
  }

  await User.create({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: "Admin",
    role: "admin",
    isEmailVerified: true,
  });

  console.log("Admin user seeded: admin@ashburn.com");
};

module.exports = seedAdmin;
