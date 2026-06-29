const nodemailer = require("nodemailer");

let smtpTransporter;
let mailMode = "none";

const getSmtpPass = () => (process.env.SMTP_PASS || "").replace(/\s/g, "");

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_USER?.trim() && getSmtpPass());

const getFromAddress = () => {
  const user = process.env.SMTP_USER?.trim();
  if (!user) return process.env.MAIL_FROM || "ADCS Tech";

  // Gmail only reliably delivers when From matches the authenticated account
  const configured = process.env.MAIL_FROM || "";
  if (configured.includes(user)) return configured;

  return `ADCS Tech <${user}>`;
};

const getAdminNotifyEmail = () => {
  const direct =
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    process.env.MAIL_TO?.trim();
  if (direct) return direct;

  const fromList = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .find(Boolean);
  if (fromList) return fromList;

  return process.env.SMTP_USER?.trim() || "ashburndcsolutions@gmail.com";
};

const initMailer = async () => {
  if (!isSmtpConfigured()) {
    mailMode = "none";
    console.error("═══════════════════════════════════════════════════════");
    console.error("[Mailer] ✗ SMTP NOT CONFIGURED — emails will NOT be sent!");
    console.error("[Mailer]   Set SMTP_USER and SMTP_PASS in ashburn-backend/.env");
    console.error("═══════════════════════════════════════════════════════");
    return mailMode;
  }

  try {
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: getSmtpPass(),
      },
    });

    await smtpTransporter.verify();
    mailMode = "smtp";
    console.log("[Mailer] ✓ SMTP ready — sending from:", getFromAddress());
    return mailMode;
  } catch (error) {
    mailMode = "none";
    console.error("[Mailer] ✗ SMTP verify failed:", error.message);
    console.error("[Mailer]   Tip: use Gmail App Password (no spaces needed in .env)");
    return mailMode;
  }
};

const sendMail = async ({ to, subject, html, replyTo }) => {
  const recipient = to || getAdminNotifyEmail();
  console.log(`[Mailer] Sending → ${recipient} | "${subject}"`);

  if (mailMode !== "smtp" || !smtpTransporter) {
    const error = "SMTP not configured. Add SMTP_USER and SMTP_PASS to .env.";
    console.error(`[Mailer] ✗ BLOCKED — ${error}`);
    return { ok: false, error };
  }

  try {
    const info = await smtpTransporter.sendMail({
      from: getFromAddress(),
      to: recipient,
      replyTo,
      subject,
      html,
    });

    console.log(`[Mailer] ✓ SENT → ${recipient} | id: ${info.messageId}`);
    return { ok: true, messageId: info.messageId, mode: "smtp" };
  } catch (error) {
    console.error(`[Mailer] ✗ FAILED → ${recipient} | ${error.message}`);
    return { ok: false, error: error.message };
  }
};

module.exports = {
  sendMail,
  isSmtpConfigured,
  initMailer,
  getMailMode: () => mailMode,
  getAdminNotifyEmail,
};
