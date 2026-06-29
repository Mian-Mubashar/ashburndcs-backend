const crypto = require("crypto");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

const buildVerificationUrl = (token) =>
  `${getFrontendUrl()}/verify-email/${token}`;

const buildResetPasswordUrl = (token) =>
  `${getFrontendUrl()}/reset-password?token=${token}`;

module.exports = {
  hashToken,
  getFrontendUrl,
  buildVerificationUrl,
  buildResetPasswordUrl,
};
