const { getFrontendUrl, buildVerificationUrl, buildResetPasswordUrl } = require("./authHelpers");

const brandColor = "#6415ff";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const baseTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:${brandColor};padding:28px 32px;">
              <h1 style="margin:0;color:#fff;font-size:22px;">ADCS Tech Solutions</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#374151;font-size:15px;line-height:1.7;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} Ashburn DCS. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const actionButton = (url, label) => `
  <p style="text-align:center;margin:28px 0;">
    <a href="${url}"
       style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;
              padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;">
      ${label}
    </a>
  </p>
`;

const verificationEmail = (token) => {
  const url = buildVerificationUrl(token);
  return {
    subject: "Verify your ADCS account",
    html: baseTemplate(
      "Verify Email",
      `
        <h2 style="margin:0 0 12px;color:#111827;">Welcome to ADCS!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below.</p>
        ${actionButton(url, "Verify Email Address")}
        <p style="color:#9ca3af;font-size:13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      `
    ),
  };
};

const passwordResetEmail = (token) => {
  const url = buildResetPasswordUrl(token);
  return {
    subject: "Reset your ADCS password",
    html: baseTemplate(
      "Reset Password",
      `
        <h2 style="margin:0 0 12px;color:#111827;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
        ${actionButton(url, "Reset Password")}
        <p style="color:#9ca3af;font-size:13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      `
    ),
  };
};

const welcomeEmail = () => ({
  subject: "Your ADCS account is verified!",
  html: baseTemplate(
    "Account Verified",
    `
      <h2 style="margin:0 0 12px;color:#111827;">Email Verified Successfully!</h2>
      <p>Your account is now active. You can sign in and access all ADCS services.</p>
      ${actionButton(`${getFrontendUrl()}/login`, "Sign In Now")}
    `
  ),
});

const enrollmentReceivedEmail = ({ fullName, courseTitle }) => ({
  subject: "Enrollment Request Received — ADCS",
  html: baseTemplate(
    "Enrollment Received",
    `
      <h2 style="margin:0 0 12px;color:#111827;">Hello ${fullName},</h2>
      <p>Thank you for enrolling in <strong>${courseTitle}</strong>.</p>
      <p>Your request has been received and is currently <strong>Pending</strong> admin approval.</p>
      <p>We will email you once your enrollment is reviewed.</p>
    `
  ),
});

const enrollmentApprovedEmail = ({ fullName, courseTitle }) => {
  const url = `${getFrontendUrl()}/dashboard`;
  return {
    subject: "Enrollment Approved — You're Enrolled!",
    html: baseTemplate(
      "Enrollment Approved",
      `
        <h2 style="margin:0 0 12px;color:#111827;">Congratulations ${fullName}!</h2>
        <p>Your enrollment for <strong>${courseTitle}</strong> has been <strong>approved</strong>.</p>
        <p>You are fully enrolled — no extra registration step needed.</p>
        <p>Sign in with your account to open your student dashboard.</p>
        ${actionButton(url, "Go to Dashboard")}
      `
    ),
  };
};

const adminNewEnrollmentEmail = ({
  fullName,
  email,
  phone,
  education,
  courseTitle,
  message,
}) => ({
  subject: `New Enrollment — ${fullName} (${courseTitle})`,
  html: baseTemplate(
    "New Enrollment Request",
    `
      <h2 style="margin:0 0 12px;color:#111827;">New student enrollment</h2>
      <p>A new enrollment request needs your review.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#6b7280;">Name</td><td style="padding:8px 0;font-weight:600;">${fullName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;font-weight:600;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;font-weight:600;">${phone}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Education</td><td style="padding:8px 0;font-weight:600;">${education}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Course</td><td style="padding:8px 0;font-weight:600;">${courseTitle}</td></tr>
        ${message ? `<tr><td style="padding:8px 0;color:#6b7280;">Message</td><td style="padding:8px 0;">${message}</td></tr>` : ""}
      </table>
      ${actionButton(`${getFrontendUrl()}/admin`, "Review in Admin Panel")}
    `
  ),
});

const scheduleUpdatedEmail = ({ fullName, classTitle, date, time }) => ({
  subject: "Class Schedule Updated — ADCS",
  html: baseTemplate(
    "Schedule Update",
    `
      <h2 style="margin:0 0 12px;color:#111827;">Hello ${fullName},</h2>
      <p>Your class schedule has been updated:</p>
      <p><strong>${classTitle}</strong><br>Date: ${date}<br>Time: ${time}</p>
      <p>Please log in to your dashboard for full details.</p>
      ${actionButton(`${getFrontendUrl()}/dashboard`, "View Dashboard")}
    `
  ),
});

const infoRow = (label, value, { isLink = false } = {}) => `
  <tr>
    <td style="padding:14px 16px;color:#6b7280;font-size:13px;font-weight:600;width:110px;vertical-align:top;border-bottom:1px solid #f3f4f6;">
      ${label}
    </td>
    <td style="padding:14px 16px;color:#111827;font-size:15px;font-weight:600;border-bottom:1px solid #f3f4f6;word-break:break-word;">
      ${
        isLink
          ? `<a href="mailto:${value}" style="color:${brandColor};text-decoration:none;">${value}</a>`
          : value
      }
    </td>
  </tr>
`;

const adminContactFormEmail = ({ name, email, phone, subject, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    subject: `New Contact — ${subject}`,
    html: baseTemplate(
      "New Contact Message",
      `
        <div style="display:inline-block;background:#f3e8ff;color:${brandColor};font-size:12px;font-weight:700;
                    letter-spacing:0.04em;text-transform:uppercase;padding:6px 12px;border-radius:999px;margin-bottom:16px;">
          New Inquiry
        </div>
        <h2 style="margin:0 0 8px;color:#111827;font-size:24px;line-height:1.3;">Someone reached out</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
          A visitor submitted the contact form on your website.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
               style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fafafa;margin-bottom:24px;">
          ${infoRow("Name", safeName)}
          ${infoRow("Email", safeEmail, { isLink: true })}
          ${infoRow("Phone", safePhone)}
          ${infoRow("Subject", safeSubject)}
        </table>

        <p style="margin:0 0 10px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
          Message
        </p>
        <div style="background:linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%);border-left:4px solid ${brandColor};
                    border-radius:0 12px 12px 0;padding:20px 22px;color:#374151;font-size:15px;line-height:1.75;">
          ${safeMessage}
        </div>

        <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;">
          Received on ${receivedAt}
        </p>

        ${actionButton(`mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}`, "Reply to Customer")}
      `
    ),
  };
};

module.exports = {
  verificationEmail,
  passwordResetEmail,
  welcomeEmail,
  enrollmentReceivedEmail,
  enrollmentApprovedEmail,
  adminNewEnrollmentEmail,
  scheduleUpdatedEmail,
  adminContactFormEmail,
};
