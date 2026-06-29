const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const verifyExpiryMs = () =>
  (Number(process.env.EMAIL_VERIFY_EXPIRY_HOURS) || 24) * 60 * 60 * 1000;

const resetExpiryMs = () =>
  (Number(process.env.RESET_PASSWORD_EXPIRY_HOURS) || 1) * 60 * 60 * 1000;

userSchema.methods.createEmailVerificationToken = function createEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerificationExpires = Date.now() + verifyExpiryMs();
  return token;
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordExpires = Date.now() + resetExpiryMs();
  return token;
};

userSchema.methods.clearVerificationToken = function clearVerificationToken() {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
};

userSchema.methods.clearResetToken = function clearResetToken() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

module.exports = mongoose.model("User", userSchema);
