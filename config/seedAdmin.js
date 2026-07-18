const { User } = require("../models");

const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.warn("[Seed] ADMIN_EMAIL / ADMIN_PASSWORD missing in .env — skipping admin seed");
    return;
  }

  const existing = await User.scope("withPassword").findOne({ where: { email } });

  if (existing) {
    existing.role = "admin";
    existing.isEmailVerified = true;
    existing.name = existing.name || name;
    existing.password = password;
    await existing.save();
    console.log(`Admin user updated: ${email}`);
    return;
  }

  await User.create({
    email,
    password,
    name,
    role: "admin",
    isEmailVerified: true,
  });

  console.log(`Admin user seeded: ${email}`);
};

module.exports = seedAdmin;
