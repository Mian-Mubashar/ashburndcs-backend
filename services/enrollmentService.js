const { Op } = require("sequelize");
const path = require("path");
const {
  Course,
  Enrollment,
  ClassSchedule,
  CourseMaterial,
  Notification,
  User,
} = require("../models");
const { sendMail } = require("../utils/mailer");
const { getFrontendUrl, hashToken } = require("../utils/authHelpers");
const { scheduleUpdatedEmail } = require("../utils/emailTemplates");
const {
  sendEnrollmentReceivedEmail,
  sendEnrollmentApprovedEmail,
  sendAdminEnrollmentNotification,
} = require("../utils/sendAuthEmail");

const courseAttrs = ["id", "title", "category", "description", "duration", "level", "isActive"];

/** Link course + schedules to user and mark enrollment completed (no password step). */
const finalizeEnrollmentForUser = async (enrollment, user) => {
  if (!enrollment.course && enrollment.courseId) {
    await enrollment.reload({ include: [{ model: Course, as: "course" }] });
  }

  await user.addEnrolledCourse(enrollment.courseId);

  const schedules = await ClassSchedule.findAll({
    where: { courseId: enrollment.courseId },
  });
  for (const schedule of schedules) {
    await schedule.addStudent(user.id);
  }

  enrollment.status = "completed";
  enrollment.userId = user.id;
  if (typeof enrollment.clearRegistrationToken === "function") {
    enrollment.clearRegistrationToken();
  }
  await enrollment.save();

  const courseTitle = enrollment.course?.title || "your course";
  await Notification.create({
    userId: user.id,
    title: "Enrollment approved",
    message: `You are fully enrolled in ${courseTitle}. Check your dashboard for schedules and materials.`,
    type: "enrollment",
  });

  return enrollment;
};

/** After signup / login / verify — attach any approved/completed enrollments for this email. */
const linkEnrollmentsForUser = async (user) => {
  if (!user?.id || !user?.email) return;

  const enrollments = await Enrollment.findAll({
    where: {
      email: user.email.toLowerCase(),
      status: { [Op.in]: ["approved", "completed"] },
      [Op.or]: [{ userId: null }, { userId: user.id }],
    },
    include: [{ model: Course, as: "course" }],
  });

  for (const enrollment of enrollments) {
    const alreadyLinked =
      enrollment.userId === user.id && enrollment.status === "completed";
    if (alreadyLinked) {
      // Ensure course association exists
      await user.addEnrolledCourse(enrollment.courseId);
      continue;
    }
    await finalizeEnrollmentForUser(enrollment, user);
  }
};

const getPublicSchedules = async () => {
  const schedules = await ClassSchedule.findAll({
    include: [{ model: Course, as: "course", attributes: courseAttrs }],
    order: [["date", "ASC"]],
  });

  return {
    status: 200,
    body: {
      success: true,
      schedules: schedules
        .filter((s) => s.course && s.course.isActive !== false)
        .map((s) => {
          const json = s.toJSON();
          if (json.course) {
            json.course._id = json.course._id || json.course.id;
            json.course.id = json.course.id || json.course._id;
          }
          json._id = json._id || json.id;
          return json;
        }),
    },
  };
};

const getCourses = async () => {
  const courses = await Course.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });
  return { status: 200, body: { success: true, courses } };
};

const getAllCourses = async () => {
  const courses = await Course.findAll({
    order: [["createdAt", "DESC"]],
  });
  return { status: 200, body: { success: true, courses } };
};

const submitEnrollment = async (data) => {
  const { fullName, email, phone, education, courseId, message } = data;

  if (!fullName || !email || !phone || !education || !courseId) {
    return { status: 400, body: { error: "All required fields must be filled" } };
  }

  const course = await Course.findByPk(courseId);
  if (!course) return { status: 404, body: { error: "Course not found" } };

  const existing = await Enrollment.findOne({
    where: {
      email: email.toLowerCase(),
      courseId,
      status: { [Op.in]: ["pending", "approved", "completed"] },
    },
  });
  if (existing) {
    return {
      status: 409,
      body: {
        error:
          existing.status === "completed"
            ? "You are already enrolled in this course"
            : "You already have a pending or approved enrollment for this course",
      },
    };
  }

  const enrollment = await Enrollment.create({
    fullName,
    email: email.toLowerCase(),
    phone,
    education,
    courseId,
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
      enrollmentId: enrollment.id,
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

  const enrollments = await Enrollment.findAll({
    where: { email: email.toLowerCase() },
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
    order: [["createdAt", "DESC"]],
  });

  return {
    status: 200,
    body: {
      success: true,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        status: e.status,
        courseId: e.courseId,
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

  const emailWhere = { email: email.toLowerCase() };
  let enrollment;

  if (enrollmentId) {
    enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, ...emailWhere },
      include: [{ model: Course, as: "course" }],
    });
  } else {
    enrollment = await Enrollment.findOne({
      where: { ...emailWhere, status: "approved" },
      include: [{ model: Course, as: "course" }],
      order: [["createdAt", "DESC"]],
    });
    if (!enrollment) {
      enrollment = await Enrollment.findOne({
        where: emailWhere,
        include: [{ model: Course, as: "course" }],
        order: [["createdAt", "DESC"]],
      });
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
      body: {
        success: true,
        status: "completed",
        message: "You are fully enrolled! Sign in and open your Student Dashboard.",
      },
    };
  }

  if (enrollment.status === "rejected") {
    return { status: 400, body: { error: "Enrollment was not approved.", status: "rejected" } };
  }

  // Legacy approved (old password step) — finalize now if account exists
  if (enrollment.status === "approved") {
    const user = await User.findOne({ where: { email: enrollment.email } });
    if (user) {
      await finalizeEnrollmentForUser(enrollment, user);
      return {
        status: 200,
        body: {
          success: true,
          status: "completed",
          message: "You are fully enrolled! Sign in and open your Student Dashboard.",
        },
      };
    }
    enrollment.status = "completed";
    enrollment.clearRegistrationToken();
    await enrollment.save();
    return {
      status: 200,
      body: {
        success: true,
        status: "completed",
        message: "You are enrolled! Sign up or sign in with this email to access your dashboard.",
      },
    };
  }

  return { status: 400, body: { error: "Unable to process enrollment status." } };
};

const getEnrollmentStatus = async (enrollmentId) => {
  const enrollment = await Enrollment.findByPk(enrollmentId, {
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
  });
  if (!enrollment) {
    return { status: 404, body: { error: "Enrollment not found" } };
  }

  return {
    status: 200,
    body: {
      success: true,
      enrollment: {
        id: enrollment.id,
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
    where: {
      registrationToken: hashToken(token),
      registrationExpires: { [Op.gt]: new Date() },
      status: "approved",
    },
    include: [{ model: Course, as: "course" }],
  });

  if (!enrollment) {
    return { status: 400, body: { error: "Invalid or expired registration link" } };
  }

  let user = await User.scope("withPassword").findOne({
    where: { email: enrollment.email },
  });

  if (!user) {
    user = await User.create({
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
    await user.save();
  }

  await user.addEnrolledCourse(enrollment.courseId);

  enrollment.status = "completed";
  enrollment.userId = user.id;
  enrollment.clearRegistrationToken();
  await enrollment.save();

  const schedules = await ClassSchedule.findAll({
    where: { courseId: enrollment.courseId },
  });
  for (const schedule of schedules) {
    await schedule.addStudent(user.id);
  }

  await Notification.create({
    userId: user.id,
    title: "Welcome to ADCS!",
    message: `You are now enrolled in ${enrollment.course.title}. Check your dashboard for schedules and materials.`,
    type: "enrollment",
  });

  const jwt = require("jsonwebtoken");
  const authToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: 200,
    body: {
      success: true,
      message: "Registration complete! You are now enrolled.",
      token: authToken,
      user: { id: user.id, _id: user.id, email: user.email, name: user.name, role: user.role },
    },
  };
};

const getStudentDashboard = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Course, as: "enrolledCourses" }],
  });

  if (!user.name) {
    const enrollment = await Enrollment.findOne({
      where: { email: user.email },
      order: [["createdAt", "DESC"]],
      attributes: ["fullName"],
    });
    if (enrollment?.fullName) {
      user.name = enrollment.fullName;
      await user.save();
    }
  }

  const enrolledCourseIds = (user.enrolledCourses || []).map((c) => c.id);

  const schedules = await ClassSchedule.findAll({
    include: [
      { model: Course, as: "course", attributes: ["id", "title"] },
      {
        model: User,
        as: "students",
        attributes: ["id"],
        through: { attributes: [] },
        required: false,
      },
    ],
    order: [["date", "ASC"]],
  });

  const filteredSchedules = schedules.filter(
    (s) =>
      (s.students || []).some((st) => st.id === Number(userId)) ||
      enrolledCourseIds.includes(s.courseId)
  );

  const notifications = await Notification.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: 20,
  });

  const studentEnrollments = await Enrollment.findAll({
    where: {
      [Op.or]: [{ userId }, { email: user.email }],
      status: "completed",
    },
    attributes: ["courseId"],
  });

  const courseIds = [
    ...enrolledCourseIds,
    ...studentEnrollments.map((e) => e.courseId),
  ].filter(Boolean);

  const uniqueCourseIds = [...new Set(courseIds.map(Number))];

  if (studentEnrollments.length && enrolledCourseIds.length < uniqueCourseIds.length) {
    await user.setEnrolledCourses(uniqueCourseIds);
  }

  const materials = uniqueCourseIds.length
    ? await CourseMaterial.findAll({
        where: { courseId: { [Op.in]: uniqueCourseIds } },
        include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
        order: [
          ["order", "ASC"],
          ["createdAt", "DESC"],
        ],
      })
    : [];

  const applications = await Enrollment.findAll({
    where: { email: user.email },
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
    order: [["createdAt", "DESC"]],
  });

  const refreshedUser = await User.findByPk(userId, {
    include: [{ model: Course, as: "enrolledCourses" }],
  });

  return {
    status: 200,
    body: {
      success: true,
      user: { name: refreshedUser.name, email: refreshedUser.email },
      courses: refreshedUser.enrolledCourses,
      applications,
      schedules: filteredSchedules,
      materials,
      notifications,
    },
  };
};

const getAllEnrollments = async () => {
  const enrollments = await Enrollment.findAll({
    include: [
      { model: Course, as: "course", attributes: ["id", "title"] },
      { model: User, as: "user", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  return { status: 200, body: { success: true, enrollments } };
};

const approveEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findByPk(enrollmentId, {
    include: [{ model: Course, as: "course" }],
  });
  if (!enrollment) return { status: 404, body: { error: "Enrollment not found" } };
  if (enrollment.status !== "pending") {
    return { status: 400, body: { error: "Enrollment is not pending" } };
  }

  const user = await User.findOne({ where: { email: enrollment.email } });

  if (user) {
    await finalizeEnrollmentForUser(enrollment, user);
  } else {
    // No account yet — mark enrolled; link when they sign up / verify with same email
    enrollment.status = "completed";
    enrollment.clearRegistrationToken();
    await enrollment.save();
  }

  console.log("[Enrollment] APPROVE → completed", {
    id: enrollmentId,
    student: enrollment.email,
    name: enrollment.fullName,
    course: enrollment.course?.title,
    linkedUser: Boolean(user),
  });

  const mail = await sendEnrollmentApprovedEmail(
    enrollment.email,
    enrollment.fullName,
    enrollment.course.title
  );

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      studentEmail: enrollment.email,
      status: "completed",
      message: mail.ok
        ? `Approved & enrolled! Email sent to ${enrollment.email}`
        : `Approved & enrolled, but email could not be sent (${mail.message}).`,
    },
  };
};

const resendApprovalEmail = async (enrollmentId) => {
  const enrollment = await Enrollment.findByPk(enrollmentId, {
    include: [{ model: Course, as: "course" }],
  });
  if (!enrollment) return { status: 404, body: { error: "Enrollment not found" } };
  if (!["approved", "completed"].includes(enrollment.status)) {
    return { status: 400, body: { error: "Enrollment must be approved first" } };
  }

  // Legacy "approved" waiting for password → finish enrollment now
  if (enrollment.status === "approved") {
    const user = await User.findOne({ where: { email: enrollment.email } });
    if (user) {
      await finalizeEnrollmentForUser(enrollment, user);
    } else {
      enrollment.status = "completed";
      enrollment.clearRegistrationToken();
      await enrollment.save();
    }
  }

  const mail = await sendEnrollmentApprovedEmail(
    enrollment.email,
    enrollment.fullName,
    enrollment.course.title
  );

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      message: mail.ok
        ? `Email resent to ${enrollment.email}`
        : `Email failed: ${mail.message}`,
    },
  };
};

const rejectEnrollment = async (enrollmentId, adminNote = "") => {
  const enrollment = await Enrollment.findByPk(enrollmentId);
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
  const course = await Course.findByPk(id);
  if (!course) return { status: 404, body: { error: "Course not found" } };
  await course.update(data);
  return { status: 200, body: { success: true, course } };
};

const deleteCourse = async (id) => {
  await Course.destroy({ where: { id } });
  return { status: 200, body: { success: true, message: "Course deleted" } };
};

const getWeeklyDatesForRestOfMonth = (dateInput) => {
  const start = new Date(`${String(dateInput).slice(0, 10)}T12:00:00`);
  const dates = [];
  const endOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  let current = new Date(start);
  while (current <= endOfMonth) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 7);
  }
  return dates;
};

const normalizeSchedulePayload = (data) => {
  const payload = { ...data };
  if (payload.course && !payload.courseId) {
    payload.courseId = payload.course;
  }
  delete payload.course;
  delete payload.repeatWeekly;
  delete payload.students;
  return payload;
};

const createSchedule = async (data) => {
  const { repeatWeekly } = data;
  const scheduleData = normalizeSchedulePayload(data);

  if (!repeatWeekly) {
    const schedule = await ClassSchedule.create(scheduleData);
    return { status: 201, body: { success: true, schedule, count: 1 } };
  }

  const dates = getWeeklyDatesForRestOfMonth(scheduleData.date);
  const schedules = await ClassSchedule.bulkCreate(
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
  const schedule = await ClassSchedule.findByPk(id);
  if (!schedule) return { status: 404, body: { error: "Schedule not found" } };

  await schedule.update(normalizeSchedulePayload(data));
  await schedule.reload({ include: [{ model: Course, as: "course" }] });

  const students = await User.findAll({
    include: [
      {
        model: Course,
        as: "enrolledCourses",
        where: { id: schedule.courseId },
        through: { attributes: [] },
        required: true,
      },
    ],
  });

  for (const student of students) {
    await Notification.create({
      userId: student.id,
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
  await ClassSchedule.destroy({ where: { id } });
  return { status: 200, body: { success: true, message: "Schedule deleted" } };
};

const getAllSchedules = async () => {
  const schedules = await ClassSchedule.findAll({
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
    order: [["createdAt", "ASC"]],
  });
  return { status: 200, body: { success: true, schedules } };
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

const normalizeMaterialPayload = (data) => {
  const payload = { ...data };
  if (payload.course && !payload.courseId) {
    payload.courseId = payload.course;
  }
  delete payload.course;
  return payload;
};

const createMaterial = async (data, file) => {
  const validationError = validateMaterialPayload(data, file);
  if (validationError) return { status: 400, body: { error: validationError } };

  const payload = normalizeMaterialPayload(data);
  if (file) {
    payload.fileUrl = `/uploads/materials/${file.filename}`;
    payload.fileName = file.originalname;
  }
  if (payload.type === "document") payload.url = "";

  const material = await CourseMaterial.create(payload);
  return { status: 201, body: { success: true, material } };
};

const getAllMaterials = async () => {
  const materials = await CourseMaterial.findAll({
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
    order: [["createdAt", "DESC"]],
  });
  return { status: 200, body: { success: true, materials } };
};

const updateMaterial = async (id, data, file) => {
  const existing = await CourseMaterial.findByPk(id);
  if (!existing) return { status: 404, body: { error: "Material not found" } };

  const validationError = validateMaterialPayload(data, file, existing);
  if (validationError) return { status: 400, body: { error: validationError } };

  const payload = normalizeMaterialPayload(data);
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

  await existing.update(payload);
  await existing.reload({
    include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
  });
  return { status: 200, body: { success: true, material: existing } };
};

const deleteMaterial = async (id) => {
  const material = await CourseMaterial.findByPk(id);
  if (material?.fileUrl) removeMaterialFile(material.fileUrl);
  await CourseMaterial.destroy({ where: { id } });
  return { status: 200, body: { success: true, message: "Material deleted" } };
};

const getAdminStats = async () => {
  const [courses, enrollments, pending, schedules, students] = await Promise.all([
    Course.count({ where: { isActive: true } }),
    Enrollment.count(),
    Enrollment.count({ where: { status: "pending" } }),
    ClassSchedule.count(),
    User.count({ where: { role: "student" } }),
  ]);
  return {
    status: 200,
    body: { success: true, stats: { courses, enrollments, pending, schedules, students } },
  };
};

module.exports = {
  getCourses,
  getAllCourses,
  getPublicSchedules,
  submitEnrollment,
  getEnrollmentStatus,
  getEnrollmentsByEmail,
  requestRegistrationLink,
  completeRegistration,
  linkEnrollmentsForUser,
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
