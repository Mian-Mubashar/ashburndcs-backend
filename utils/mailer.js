const nodemailer = require("nodemailer");

let transporter = null;

const clean = (value) => {
  if (value == null) return "";
  let v = String(value).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v.trim();
};

const getMailUser = () =>
  clean(process.env.MAIL_USER || process.env.SMTP_USER);

const getMailPass = () =>
  clean(process.env.MAIL_PASS || process.env.SMTP_PASS).replace(/\s/g, "");

const isMailConfigured = () => Boolean(getMailUser() && getMailPass());

const getFromAddress = () => {
  const configured = clean(process.env.MAIL_FROM);
  if (configured) return configured;
  const user = getMailUser();
  return user ? `ADCS Tech <${user}>` : "";
};

const getAdminNotifyEmail = () =>
  clean(process.env.ADMIN_NOTIFY_EMAIL) ||
  clean(process.env.MAIL_TO) ||
  getMailUser();

/** Create Nodemailer transport once — no SMTP verify on boot. */
const initMailer = async () => {
  if (!isMailConfigured()) {
    console.warn("[Mail] MAIL_USER / MAIL_PASS (or SMTP_*) missing — emails disabled");
    transporter = null;
    return "none";
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getMailUser(),
      pass: getMailPass(),
    },
  });

  console.log("[Mail] Nodemailer ready — from:", getFromAddress());
  return "gmail";
};

const getTransporter = async () => {
  if (transporter) return transporter;
  await initMailer();
  return transporter;
};

const sendMail = async ({ to, subject, html, replyTo, kind }) => {
  const recipient = clean(to).toLowerCase();
  if (!recipient) {
    const error = "Mail recipient missing";
    console.error(`[Mail] ✗ ${error}`);
    return { ok: false, error };
  }
  const label = kind ? `${kind} ` : "";
  console.log(`[Mail] Sending ${label}→ ${recipient} | "${subject}"`);

  const tx = await getTransporter();
  if (!tx) {
    const error = "Mail not configured. Set MAIL_USER and MAIL_PASS in .env";
    console.error(`[Mail] ✗ ${error}`);
    return { ok: false, error };
  }

  try {
    const info = await tx.sendMail({
      from: getFromAddress(),
      to: recipient,
      replyTo,
      subject,
      html,
      bcc: [],
      cc: [],
      headers: {
        "X-ADCS-Mail-Kind": kind || "general",
        "X-ADCS-Envelope-To": recipient,
      },
    });
    const accepted = info.accepted || [];
    const rejected = info.rejected || [];
    console.log(
      `[Mail] ✓ SENT ${label}→ ${recipient} | accepted: ${accepted.join(",") || "(none)"} | rejected: ${rejected.join(",") || "(none)"} | ${info.response || ""}`
    );
    return {
      ok: true,
      messageId: info.messageId,
      accepted,
      rejected,
      mode: "nodemailer",
    };
  } catch (error) {
    console.error(`[Mail] ✗ FAILED ${label}→ ${recipient} | ${error.message}`);
    return { ok: false, error: error.message };
  }
};

module.exports = {
  sendMail,
  initMailer,
  getAdminNotifyEmail,
  isSmtpConfigured: isMailConfigured,
  getMailMode: () => (transporter ? "nodemailer" : "none"),
};
