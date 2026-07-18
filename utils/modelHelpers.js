const crypto = require("crypto");

/** Add Mongo-style `_id` so existing frontend keeps working */
const withMongoId = (Model) => {
  Object.defineProperty(Model.prototype, "_id", {
    get() {
      return this.id;
    },
  });

  const original = Model.prototype.toJSON;
  Model.prototype.toJSON = function toJSON() {
    const values = original ? original.call(this) : { ...this.get() };
    values._id = values.id;
    return values;
  };
};

const verifyExpiryMs = () =>
  (Number(process.env.EMAIL_VERIFY_EXPIRY_HOURS) || 24) * 60 * 60 * 1000;

const resetExpiryMs = () =>
  (Number(process.env.RESET_PASSWORD_EXPIRY_HOURS) || 1) * 60 * 60 * 1000;

const createHashedToken = (expiryMs) => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + expiryMs);
  return { token, hashed, expires };
};

module.exports = {
  withMongoId,
  verifyExpiryMs,
  resetExpiryMs,
  createHashedToken,
};
