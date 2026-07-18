"use strict";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    const name = process.env.ADMIN_NAME || "Admin";

    if (!email || !password) {
      console.warn("[Seeder] ADMIN_EMAIL / ADMIN_PASSWORD missing in .env — skipped");
      return;
    }

    const now = new Date();
    const hashed = await bcrypt.hash(password, 12);

    const [existing] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email LIMIT 1",
      { replacements: { email } }
    );

    if (existing.length) {
      await queryInterface.bulkUpdate(
        "users",
        {
          role: "admin",
          isEmailVerified: true,
          name,
          password: hashed,
          updatedAt: now,
        },
        { email }
      );
      return;
    }

    await queryInterface.bulkInsert("users", [
      {
        email,
        name,
        password: hashed,
        role: "admin",
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!email) return;
    await queryInterface.bulkDelete("users", { email });
  },
};
