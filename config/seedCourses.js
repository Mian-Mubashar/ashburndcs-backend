const Course = require("../models/Course");

const defaultCourses = [
  {
    title: "Data Center Technician Fundamentals",
    description: "Learn server hardware, cabling, rack installation, and data center operations from industry experts.",
    duration: "8 Weeks",
    level: "Beginner",
    category: "Data Center",
  },
  {
    title: "Network Infrastructure & Cabling",
    description: "Master structured cabling, fiber optics, network troubleshooting, and documentation standards.",
    duration: "6 Weeks",
    level: "Intermediate",
    category: "Networking",
  },
  {
    title: "IT Support & Computer Repair",
    description: "Hands-on training in PC/laptop repair, OS installation, virus removal, and customer support.",
    duration: "10 Weeks",
    level: "Beginner",
    category: "IT Services",
  },
  {
    title: "Cloud & Server Administration",
    description: "Deploy, manage, and secure cloud servers. Covers Linux, Windows Server, and virtualization.",
    duration: "12 Weeks",
    level: "Advanced",
    category: "Cloud",
  },
];

const seedCourses = async () => {
  const count = await Course.countDocuments();
  if (count === 0) {
    await Course.insertMany(defaultCourses);
    console.log("Default courses seeded");
  }
};

module.exports = seedCourses;
