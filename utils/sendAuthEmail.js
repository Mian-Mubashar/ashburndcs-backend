const { sendMail } = require("./mailer");
const {
  verificationEmail,
  passwordResetEmail,
  enrollmentReceivedEmail,
  enrollmentApprovedEmail,
  adminNewEnrollmentEmail,
} = require("./emailTemplates");

const getAdminNotifyEmail = () =>
  process.env.ADMIN_NOTIFY_EMAIL ||
  process.env.MAIL_TO ||
  "ashburndcsolutions@gmail.com";

const formatResult = (result, successMessage) => {
  if (result.ok) {
    return { ok: true, emailSent: true, message: successMessage };
  }
  return {
    ok: false,
    emailSent: false,
    message: result.error || "Could not send email. Set MAIL_USER and MAIL_PASS in server .env.",
  };
};

const sendVerificationEmail = async (email, token) => {
  const { subject, html } = verificationEmail(token);
  const result = await sendMail({ to: email, subject, html });
  return formatResult(result, "Verification email sent! Please check your inbox and spam folder.");
};

const sendPasswordResetEmail = async (email, token) => {
  const { subject, html } = passwordResetEmail(token);
  const result = await sendMail({ to: email, subject, html });
  return formatResult(result, "If the email exists, a reset link has been sent. Check your inbox.");
};

const sendEnrollmentReceivedEmail = async (email, fullName, courseTitle) => {
  console.log(`[Email] Enrollment confirmation → student: ${email}`);
  const { subject, html } = enrollmentReceivedEmail({ fullName, courseTitle });
  const result = await sendMail({ to: email, subject, html });
  if (!result.ok) console.error(`[Email] ✗ Student email failed: ${result.error}`);
  return formatResult(result, "Enrollment request submitted! Your status is Pending until admin approval.");
};

const sendAdminEnrollmentNotification = async (payload) => {
  const adminEmail = getAdminNotifyEmail();
  console.log(`[Email] Admin notification → ${adminEmail}`);
  const { subject, html } = adminNewEnrollmentEmail(payload);
  const result = await sendMail({
    to: adminEmail,
    subject,
    html,
    replyTo: payload.email,
  });
  if (!result.ok) console.error(`[Email] ✗ Admin email failed: ${result.error}`);
  return formatResult(result, "Admin notified.");
};

const sendEnrollmentApprovedEmail = async (email, fullName, courseTitle) => {
  console.log(`[Email] Sending approval email → ${email} | course: ${courseTitle}`);
  const { subject, html } = enrollmentApprovedEmail({ fullName, courseTitle });
  const result = await sendMail({ to: email, subject, html });
  if (result.ok) {
    console.log(`[Email] ✓ Approval email delivered to ${email}`);
  } else {
    console.error(`[Email] ✗ Approval email FAILED for ${email}: ${result.error}`);
  }
  return formatResult(result, `Approval email sent to ${email}.`);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEnrollmentReceivedEmail,
  sendAdminEnrollmentNotification,
  sendEnrollmentApprovedEmail,
};
