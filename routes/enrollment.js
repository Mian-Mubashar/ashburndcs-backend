const express = require("express");
const enrollmentService = require("../services/enrollmentService");
const { protect } = require("../middleware/auth");

const router = express.Router();

const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

router.get("/courses", async (_req, res) => {
  try {
    const result = await enrollmentService.getCourses();
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/schedules", async (_req, res) => {
  try {
    const result = await enrollmentService.getPublicSchedules();
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

router.post("/enrollments", handle(enrollmentService.submitEnrollment));

router.get("/enrollments/status/:id", async (req, res) => {
  try {
    const result = await enrollmentService.getEnrollmentStatus(req.params.id);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollment status" });
  }
});

router.get("/enrollments/by-email", async (req, res) => {
  try {
    const result = await enrollmentService.getEnrollmentsByEmail(req.query.email);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

router.post("/enrollments/request-link", async (req, res) => {
  try {
    const result = await enrollmentService.requestRegistrationLink(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to send registration link" });
  }
});

router.post("/enrollments/complete-registration", handle(enrollmentService.completeRegistration));

router.get("/student/dashboard", protect, async (req, res) => {
  try {
    const result = await enrollmentService.getStudentDashboard(req.user.id);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

module.exports = router;
