"use strict";

const defaultCourse = {
  title: "Data Center Server Training",
  description:
    "Hands-on training for data center servers — hardware, racking, cabling, troubleshooting, and day-to-day operations.",
  duration: "8 Weeks",
  level: "Beginner",
  category: "Data Center",
  isActive: true,
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      "SELECT COUNT(*) AS count FROM courses WHERE title = :title",
      { replacements: { title: defaultCourse.title } }
    );
    if (Number(rows[0].count) > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert("courses", [
      {
        ...defaultCourse,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("courses", {
      title: defaultCourse.title,
    });
  },
};
