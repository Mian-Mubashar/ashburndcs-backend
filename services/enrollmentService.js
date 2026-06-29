const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const ClassSchedule = require("../models/ClassSchedule");
const CourseMaterial = require("../models/CourseMaterial");
const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");
const path = require("path");
const { sendMail } = require("../utils/mailer");
const { getFrontendUrl, hashToken } = require("../utils/authHelpers");
const { scheduleUpdatedEmail } = require("../utils/emailTemplates");
const { sendEnrollmentReceivedEmail, sendEnrollmentApprovedEmail, sendAdminEnrollmentNotification } = require("../utils/sendAuthEmail");

const getPublicSchedules = async () => {
  const schedules = await ClassSchedule.find()
    .populate("course", "title category description duration level isActive")
    .sort({ date: 1 });

  return {
    status: 200,
    body: {
      success: true,
      schedules: schedules.filter((s) => s.course && s.course.isActive !== false),
    },
  };
};

const getCourses = async () => {
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
  return { status: 200, body: { success: true, courses } };
};

const submitEnrollment = async (data) => {
  const { fullName, email, phone, education, courseId, message } = data;

  if (!fullName || !email || !phone || !education || !courseId) {
    return { status: 400, body: { error: "All required fields must be filled" } };
  }

  const course = await Course.findById(courseId);
  if (!course) return { status: 404, body: { error: "Course not found" } };

  const existing = await Enrollment.findOne({
    email: email.toLowerCase(),
    course: courseId,
    status: { $in: ["pending", "approved"] },
  });
  if (existing) {
    return { status: 409, body: { error: "You already have a pending or approved enrollment for this course" } };
  }

  const enrollment = await Enrollment.create({
    fullName,
    email: email.toLowerCase(),
    phone,
    education,
    course: courseId,
    message: message || "",
    status: "pending",
  });

  const emailResult = await sendEnrollmentReceivedEmail(email, fullName, course.title);
  await sendAdminEnrollmentNotification({
    fullName,
    email,
    phone,
    education,
    courseTitle: course.title,
    message: message || "",
  });

  return {
    status: 201,
    body: {
      success: true,
      emailSent: emailResult.ok,
      status: "pending",
      message: "You are enrolled! Your application is Pending admin approval.",
      enrollmentId: enrollment._id,
      courseTitle: course.title,
      fullName: enrollment.fullName,
      email: enrollment.email,
    },
  };
};

const getEnrollmentsByEmail = async (email) => {
  if (!email?.trim()) {
    return { status: 400, body: { error: "Email is required" } };
  }

  const enrollments = await Enrollment.find({ email: email.toLowerCase() })
    .populate("course", "title")
    .sort({ createdAt: -1 });

  return {
    status: 200,
    body: {
      success: true,
      enrollments: enrollments.map((e) => ({
        id: e._id,
        status: e.status,
        courseTitle: e.course?.title,
        fullName: e.fullName,
        email: e.email,
        createdAt: e.createdAt,
        adminNote: e.adminNote || "",
      })),
    },
  };
};

const requestRegistrationLink = async ({ email, enrollmentId }) => {
  if (!email?.trim()) {
    return { status: 400, body: { error: "Email is required" } };
  }

  const query = { email: email.toLowerCase() };

  let enrollment;
  if (enrollmentId) {
    enrollment = await Enrollment.findOne({ _id: enrollmentId, ...query }).populate("course");
  } else {
    enrollment = await Enrollment.findOne({ ...query, status: "approved" })
      .populate("course")
      .sort({ createdAt: -1 });
    if (!enrollment) {
      enrollment = await Enrollment.findOne(query).populate("course").sort({ createdAt: -1 });
    }
  }
  if (!enrollment) {
    return { status: 404, body: { error: "No enrollment found for this email" } };
  }

  if (enrollment.status === "pending") {
    return {
      status: 400,
      body: { error: "Still pending admin approval. Please check back later.", status: "pending" },
    };
  }

  if (enrollment.status === "completed") {
    return {
      status: 200,
      body: { success: true, status: "completed", message: "Already registered! You can log in and go to your dashboard." },
    };
  }

  if (enrollment.status === "rejected") {
    return { status: 400, body: { error: "Enrollment was not approved.", status: "rejected" } };
  }

  const rawToken = enrollment.createRegistrationToken();
  await enrollment.save();

  const mail = await sendEnrollmentApprovedEmail(
    enrollment.email,
    enrollment.fullName,
    enrollment.course.title,
    rawToken
  );

  return {
    status: 200,
    body: {
      success: true,
      status: "approved",
      emailSent: mail.ok,
      message: mail.ok
        ? `Registration link sent to ${enrollment.email}. Check inbox and spam folder.`
        : `Could not send email. Contact admin or try again later.`,
    },
  };
};

const getEnrollmentStatus = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course", "title");
  if (!enrollment) {
    return { status: 404, body: { error: "Enrollment not found" } };
  }

  return {
    status: 200,
    body: {
      success: true,
      enrollment: {
        id: enrollment._id,
        status: enrollment.status,
        courseTitle: enrollment.course?.title,
        fullName: enrollment.fullName,
        email: enrollment.email,
        createdAt: enrollment.createdAt,
        adminNote: enrollment.adminNote || "",
      },
    },
  };
};

const completeRegistration = async ({ token, password }) => {
  if (!token || !password) {
    return { status: 400, body: { error: "Token and password are required" } };
  }
  if (password.length < 6) {
    return { status: 400, body: { error: "Password must be at least 6 characters" } };
  }

  const enrollment = await Enrollment.findOne({
    registrationToken: hashToken(token),
    registrationExpires: { $gt: Date.now() },
    status: "approved",
  }).populate("course");

  if (!enrollment) {
    return { status: 400, body: { error: "Invalid or expired registration link" } };
  }

  let user = await User.findOne({ email: enrollment.email }).select("+password");

  if (!user) {
    user = new User({
      email: enrollment.email,
      name: enrollment.fullName,
      password,
      isEmailVerified: true,
      role: "student",
    });
  } else {
    user.password = password;
    user.isEmailVerified = true;
    if (!user.name && enrollment.fullName) {
      user.name = enrollment.fullName;
    }
  }

  if (!user.enrolledCourses?.some((id) => id.equals(enrollment.course._id))) {
    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push(enrollment.course._id);
  }
  await user.save();

  enrollment.status = "completed";
  enrollment.user = user._id;
  enrollment.clearRegistrationToken();
  await enrollment.save();

  const schedules = await ClassSchedule.find({ course: enrollment.course._id });
  for (const schedule of schedules) {
    if (!schedule.students.includes(user._id)) {
      schedule.students.push(user._id);
      await schedule.save();
    }
  }

  await Notification.create({
    user: user._id,
    title: "Welcome to ADCS!",
    message: `You are now enrolled in ${enrollment.course.title}. Check your dashboard for schedules and materials.`,
    type: "enrollment",
  });

  const jwt = require("jsonwebtoken");
  const authToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: 200,
    body: {
      success: true,
      message: "Registration complete! You are now enrolled.",
      token: authToken,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    },
  };
};

const getStudentDashboard = async (userId) => {
  const user = await User.findById(userId).populate("enrolledCourses");

  if (!user.name) {
    const enrollment = await Enrollment.findOne({ email: user.email })
      .sort({ createdAt: -1 })
      .select("fullName");
    if (enrollment?.fullName) {
      user.name = enrollment.fullName;
      await user.save();
    }
  }

  const schedules = await ClassSchedule.find({
    $or: [{ students: userId }, { course: { $in: user.enrolledCourses.map((c) => c._id) } }],
  })
    .populate("course", "title")
    .sort({ date: 1 });

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);

  const studentEnrollments = await Enrollment.find({
    $or: [{ user: userId }, { email: user.email }],
    status: "completed",
  }).select("course");

  const courseIds = [
    ...user.enrolledCourses.map((c) => c._id),
    ...studentEnrollments.map((e) => e.course),
  ].filter(Boolean);

  const uniqueCourseIds = [...new Set(courseIds.map((id) => String(id)))].map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  if (studentEnrollments.length && user.enrolledCourses.length < uniqueCourseIds.length) {
    user.enrolledCourses = uniqueCourseIds;
    await user.save();
  }

  const materials = uniqueCourseIds.length
    ? await CourseMaterial.find({ course: { $in: uniqueCourseIds } })
        .populate("course", "title")
        .sort({ order: 1, createdAt: -1 })
    : [];

  const applications = await Enrollment.find({ email: user.email })
    .populate("course", "title")
    .sort({ createdAt: -1 });

  return {
    status: 200,
    body: {
      success: true,
      user: { name: user.name, email: user.email },
      courses: user.enrolledCourses,
      applications,
      schedules,
      materials,
      notifications,
    },
  };
};

// Admin services
const getAllEnrollments = async () => {
  const enrollments = await Enrollment.find()
    .populate("course", "title")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return { status: 200, body: { success: true, enrollments } };
};

const approveEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course");
  if (!enrollment) return { status: 404, body: { error: "Enrollment not found" } };
  if (enrollment.status !== "pending") {
    return { status: 400, body: { error: "Enrollment is not pending" } };
  }

  const rawToken = enrollment.createRegistrationToken();
  enrollment.status = "approved";
  await enrollment.save();

  const registrationLink = `${getFrontendUrl()}/complete-enrollment?token=${rawToken}`;

  console.log("[Enrollment] APPROVE", {
    id: enrollmentId,
    student: enrollment.email,
    name: enrollment.fullName,
    course: enrollment.course?.title,
  });

  const mail = await sendEnrollmentApprovedEmail(
    enrollment.email,
    enrollment.fullName,
    enrollment.course.title,
    rawToken
  );

  if (!mail.ok) {
    console.error("[Enrollment] ✗ Student did NOT receive email. SMTP required.");
    console.error("[Enrollment]   Manual link for student:", registrationLink);
  }

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      studentEmail: enrollment.email,
      registrationLink: mail.ok ? null : registrationLink,
      message: mail.ok
        ? `Approved! Email sent to ${enrollment.email}`
        : `Approved but email could not be sent (${mail.message}). Copy the registration link below and send it to the student manually.`,
    },
  };
};

const resendApprovalEmail = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course");
  if (!enrollment) return { status: 404, body: { error: "Enrollment not found" } };
  if (enrollment.status !== "approved") {
    return { status: 400, body: { error: "Enrollment must be approved first" } };
  }

  const rawToken = enrollment.createRegistrationToken();
  await enrollment.save();

  const registrationLink = `${getFrontendUrl()}/complete-enrollment?token=${rawToken}`;
  const mail = await sendEnrollmentApprovedEmail(
    enrollment.email,
    enrollment.fullName,
    enrollment.course.title,
    rawToken
  );

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      registrationLink: mail.ok ? null : registrationLink,
      message: mail.ok
        ? `Email resent to ${enrollment.email}`
        : `Email failed: ${mail.message}`,
    },
  };
};

const rejectEnrollment = async (enrollmentId, adminNote = "") => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) return { status: 404, body: { error: "Enrollment not found" } };

  enrollment.status = "rejected";
  enrollment.adminNote = adminNote;
  await enrollment.save();

  return { status: 200, body: { success: true, message: "Enrollment rejected" } };
};

const createCourse = async (data) => {
  const course = await Course.create(data);
  return { status: 201, body: { success: true, course } };
};

const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, { new: true });
  if (!course) return { status: 404, body: { error: "Course not found" } };
  return { status: 200, body: { success: true, course } };
};

const deleteCourse = async (id) => {
  await Course.findByIdAndDelete(id);
  return { status: 200, body: { success: true, message: "Course deleted" } };
};

const getWeeklyDatesForRestOfMonth = (dateInput) => {
  const start = new Date(`${String(dateInput).slice(0, 10)}T12:00:00`);
  const dates = [];
  const endOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  let current = new Date(start);
  while (current <= endOfMonth) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  return dates;
};

const createSchedule = async (data) => {
  const { repeatWeekly, ...scheduleData } = data;

  if (!repeatWeekly) {
    const schedule = await ClassSchedule.create(scheduleData);
    return { status: 201, body: { success: true, schedule, count: 1 } };
  }

  const dates = getWeeklyDatesForRestOfMonth(scheduleData.date);
  const schedules = await ClassSchedule.insertMany(
    dates.map((date) => ({ ...scheduleData, date }))
  );

  return {
    status: 201,
    body: {
      success: true,
      schedules,
      count: schedules.length,
      message: `Created ${schedules.length} weekly sessions for this month.`,
    },
  };
};

const updateSchedule = async (id, data) => {
  const schedule = await ClassSchedule.findByIdAndUpdate(id, data, { new: true }).populate("course");
  if (!schedule) return { status: 404, body: { error: "Schedule not found" } };

  const students = await User.find({
    enrolledCourses: schedule.course._id,
  });

  for (const student of students) {
    await Notification.create({
      user: student._id,
      title: "Schedule Updated",
      message: `${schedule.title} has been rescheduled.`,
      type: "schedule",
    });
    const emailData = scheduleUpdatedEmail({
      fullName: student.name || student.email,
      classTitle: schedule.title,
      date: new Date(schedule.date).toLocaleDateString(),
      time: `${schedule.startTime} - ${schedule.endTime}`,
    });
    await sendMail({ to: student.email, subject: emailData.subject, html: emailData.html });
  }

  return { status: 200, body: { success: true, schedule } };
};

const deleteSchedule = async (id) => {
  await ClassSchedule.findByIdAndDelete(id);
  return { status: 200, body: { success: true, message: "Schedule deleted" } };
};

const getAllSchedules = async () => {
  const schedules = await ClassSchedule.find()
    .populate("course", "title")
    .sort({ createdAt: 1 });
  return { status: 200, body: { success: true, schedules } };
};

const createMaterial = async (data, file) => {
  const validationError = validateMaterialPayload(data, file);
  if (validationError) return { status: 400, body: { error: validationError } };

  const payload = { ...data };
  if (file) {
    payload.fileUrl = `/uploads/materials/${file.filename}`;
    payload.fileName = file.originalname;
  }
  if (payload.type === "document") payload.url = "";

  const material = await CourseMaterial.create(payload);
  return { status: 201, body: { success: true, material } };
};

const validateMaterialPayload = (data, file, existing = null) => {
  const type = data.type;
  const url = (data.url || "").trim();
  const hasFile = Boolean(file) || Boolean(existing?.fileUrl);

  if (!type) return "Material type is required.";
  if (type === "video" && !url) return "Video URL is required.";
  if (type === "document" && !hasFile) return "Please upload a document file.";
  if (type === "assignment" && !url && !hasFile) {
    return "Assignment needs a URL, an uploaded file, or both.";
  }
  return null;
};

const removeMaterialFile = (fileUrl) => {
  if (!fileUrl) return;
  const fs = require("fs");
  const filePath = path.join(__dirname, "..", fileUrl.replace(/^\//, ""));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const getAllMaterials = async () => {
  const materials = await CourseMaterial.find()
    .populate("course", "title")
    .sort({ createdAt: -1 });
  return { status: 200, body: { success: true, materials } };
};

const updateMaterial = async (id, data, file) => {
  const existing = await CourseMaterial.findById(id);
  if (!existing) return { status: 404, body: { error: "Material not found" } };

  const validationError = validateMaterialPayload(data, file, existing);
  if (validationError) return { status: 400, body: { error: validationError } };

  const payload = { ...data };
  if (file) {
    removeMaterialFile(existing.fileUrl);
    payload.fileUrl = `/uploads/materials/${file.filename}`;
    payload.fileName = file.originalname;
  }
  if (payload.type === "document") payload.url = "";
  if (payload.type === "video" && existing.fileUrl) {
    removeMaterialFile(existing.fileUrl);
    payload.fileUrl = "";
    payload.fileName = "";
  }

  const material = await CourseMaterial.findByIdAndUpdate(id, payload, { new: true }).populate(
    "course",
    "title"
  );
  return { status: 200, body: { success: true, material } };
};

const deleteMaterial = async (id) => {
  const material = await CourseMaterial.findById(id);
  if (material?.fileUrl) removeMaterialFile(material.fileUrl);
  await CourseMaterial.findByIdAndDelete(id);
  return { status: 200, body: { success: true, message: "Material deleted" } };
};

const getAdminStats = async () => {
  const [courses, enrollments, pending, schedules, students] = await Promise.all([
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: "pending" }),
    ClassSchedule.countDocuments(),
    User.countDocuments({ role: "student" }),
  ]);
  return { status: 200, body: { success: true, stats: { courses, enrollments, pending, schedules, students } } };
};

module.exports = {
  getCourses,
  getPublicSchedules,
  submitEnrollment,
  getEnrollmentStatus,
  getEnrollmentsByEmail,
  requestRegistrationLink,
  completeRegistration,
  getStudentDashboard,
  getAllEnrollments,
  approveEnrollment,
  resendApprovalEmail,
  rejectEnrollment,
  createCourse,
  updateCourse,
  deleteCourse,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
  createMaterial,
  getAllMaterials,
  updateMaterial,
  deleteMaterial,
  getAdminStats,
};
