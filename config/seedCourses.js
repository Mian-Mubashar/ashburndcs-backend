const { Op } = require("sequelize");
const { Course } = require("../models");

const DEFAULT_COURSE = {
  title: "Data Center Server Training",
  description:
    "Hands-on training for data center servers — hardware, racking, cabling, troubleshooting, and day-to-day operations.",
  duration: "8 Weeks",
  level: "Beginner",
  category: "Data Center",
  isActive: true,
};

/** Old seeded courses — hide so only the default shows unless admin re-adds */
const LEGACY_SEED_TITLES = [
  "Data Center Technician Fundamentals",
  "Network Infrastructure & Cabling",
  "IT Support & Computer Repair",
  "Cloud & Server Administration",
];

const seedCourses = async () => {
  const existing = await Course.findOne({
    where: { title: DEFAULT_COURSE.title },
  });

  if (!existing) {
    await Course.create(DEFAULT_COURSE);
    console.log("Default course seeded: Data Center Server Training");
  }

  const [updated] = await Course.update(
    { isActive: false },
    {
      where: {
        title: { [Op.in]: LEGACY_SEED_TITLES },
        isActive: true,
      },
    }
  );

  if (updated > 0) {
    console.log(`Deactivated ${updated} legacy default course(s)`);
  }
};

module.exports = seedCourses;
