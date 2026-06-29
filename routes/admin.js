const express = require("express");
const enrollmentService = require("../services/enrollmentService");
const { protect, adminOnly } = require("../middleware/auth");
const uploadMaterial = require("../middleware/uploadMaterial");

const router = express.Router();

const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(...(Array.isArray(fn._args) ? fn._args.map((k) => req[k]) : [req.body, req.params.id]));
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

router.use(protect, adminOnly);

router.get("/stats", async (_req, res) => {
  const result = await enrollmentService.getAdminStats();
  res.status(result.status).json(result.body);
});

router.get("/enrollments", async (_req, res) => {
  const result = await enrollmentService.getAllEnrollments();
  res.status(result.status).json(result.body);
});

router.patch("/enrollments/:id/approve", async (req, res) => {
  const result = await enrollmentService.approveEnrollment(req.params.id);
  res.status(result.status).json(result.body);
});

router.post("/enrollments/:id/resend-email", async (req, res) => {
  const result = await enrollmentService.resendApprovalEmail(req.params.id);
  res.status(result.status).json(result.body);
});

router.patch("/enrollments/:id/reject", async (req, res) => {
  const result = await enrollmentService.rejectEnrollment(req.params.id, req.body.adminNote);
  res.status(result.status).json(result.body);
});

router.post("/courses", async (req, res) => {
  const result = await enrollmentService.createCourse(req.body);
  res.status(result.status).json(result.body);
});

router.put("/courses/:id", async (req, res) => {
  const result = await enrollmentService.updateCourse(req.params.id, req.body);
  res.status(result.status).json(result.body);
});

router.delete("/courses/:id", async (req, res) => {
  const result = await enrollmentService.deleteCourse(req.params.id);
  res.status(result.status).json(result.body);
});

router.get("/schedules", async (_req, res) => {
  const result = await enrollmentService.getAllSchedules();
  res.status(result.status).json(result.body);
});

router.post("/schedules", async (req, res) => {
  const result = await enrollmentService.createSchedule(req.body);
  res.status(result.status).json(result.body);
});

router.put("/schedules/:id", async (req, res) => {
  const result = await enrollmentService.updateSchedule(req.params.id, req.body);
  res.status(result.status).json(result.body);
});

router.delete("/schedules/:id", async (req, res) => {
  const result = await enrollmentService.deleteSchedule(req.params.id);
  res.status(result.status).json(result.body);
});

router.get("/materials", async (_req, res) => {
  const result = await enrollmentService.getAllMaterials();
  res.status(result.status).json(result.body);
});

router.post("/materials", uploadMaterial.single("file"), async (req, res) => {
  try {
    const result = await enrollmentService.createMaterial(req.body, req.file);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Create material error:", error);
    res.status(400).json({ error: error.message || "Failed to create material" });
  }
});

router.put("/materials/:id", uploadMaterial.single("file"), async (req, res) => {
  try {
    const result = await enrollmentService.updateMaterial(req.params.id, req.body, req.file);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Update material error:", error);
    res.status(400).json({ error: error.message || "Failed to update material" });
  }
});

router.delete("/materials/:id", async (req, res) => {
  const result = await enrollmentService.deleteMaterial(req.params.id);
  res.status(result.status).json(result.body);
});

module.exports = router;
