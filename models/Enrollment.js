const mongoose = require("mongoose");
const crypto = require("crypto");

const enrollmentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    registrationToken: String,
    registrationExpires: Date,
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

enrollmentSchema.methods.createRegistrationToken = function createRegistrationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  this.registrationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.registrationExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return token;
};

enrollmentSchema.methods.clearRegistrationToken = function clearRegistrationToken() {
  this.registrationToken = undefined;
  this.registrationExpires = undefined;
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
