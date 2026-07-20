const crypto = require("crypto");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * FRONTEND_URL may be a CORS list: "https://ashburndcs.com,https://www.ashburndcs.com"
 * Email links must use a single origin — take the first valid URL.
 */
const getFrontendUrl = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  const first = String(raw)
    .split(",")
    .map((part) => part.trim().replace(/^["']|["']$/g, ""))
    .find(Boolean);

  return (first || "http://localhost:3000").replace(/\/$/, "");
};

const buildVerificationUrl = (token) =>
  `${getFrontendUrl()}/verify-email/${encodeURIComponent(token)}`;

const buildResetPasswordUrl = (token) =>
  `${getFrontendUrl()}/reset-password?token=${encodeURIComponent(token)}`;

module.exports = {
  hashToken,
  getFrontendUrl,
  buildVerificationUrl,
  buildResetPasswordUrl,
};
