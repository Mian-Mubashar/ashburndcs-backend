const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");
const { sendMail } = require("../utils/mailer");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/sendAuthEmail");
const { hashToken } = require("../utils/authHelpers");
const { isAdminUser } = require("../middleware/auth");
const { welcomeEmail } = require("../utils/emailTemplates");
const { linkEnrollmentsForUser } = require("./enrollmentService");

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      verified: user.isEmailVerified,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async ({ email, password }) => {
  if (!email || !password) {
    return { status: 400, body: { error: "Email and password are required" } };
  }

  if (password.length < 6) {
    return { status: 400, body: { error: "Password must be at least 6 characters" } };
  }

  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { status: 409, body: { error: "Email already registered" } };
  }

  const user = User.build({ email: email.toLowerCase(), password });
  const rawToken = user.createEmailVerificationToken();
  await user.save();

  const mail = await sendVerificationEmail(user.email, rawToken);

  return {
    status: 201,
    body: {
      success: true,
      emailSent: mail.ok,
      message: mail.message,
      email: user.email,
    },
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    return { status: 400, body: { error: "Email and password are required" } };
  }

  const user = await User.scope("withPassword").findOne({
    where: { email: email.toLowerCase() },
  });
  if (!user || !(await user.comparePassword(password))) {
    return { status: 401, body: { error: "Invalid email or password" } };
  }

  if (!user.isEmailVerified) {
    return {
      status: 403,
      body: {
        error: "Please verify your email before signing in.",
        needsVerification: true,
        email: user.email,
      },
    };
  }

  const role = isAdminUser(user) ? "admin" : user.role;
  const token = signToken({ ...user.toJSON(), role });

  await linkEnrollmentsForUser(user);

  return {
    status: 200,
    body: {
      success: true,
      token,
      user: { id: user.id, _id: user.id, email: user.email, isEmailVerified: true, role },
    },
  };
};

const verifyEmail = async (rawToken) => {
  if (!rawToken) {
    return { status: 400, body: { error: "Verification token is required" } };
  }

  const hashed = hashToken(rawToken);
  const user = await User.scope("withPassword").findOne({
    where: { emailVerificationToken: hashed },
  });

  if (!user) {
    return {
      status: 400,
      body: {
        error: "Invalid or expired verification link",
        code: "INVALID_TOKEN",
      },
    };
  }

  if (user.emailVerificationExpires && new Date(user.emailVerificationExpires) < new Date()) {
    return {
      status: 400,
      body: {
        error: "Verification link has expired. Please request a new one.",
        code: "EXPIRED_TOKEN",
      },
    };
  }

  // Keep token until expiry so Gmail prefetch + user click both work (idempotent).
  const alreadyVerified = user.isEmailVerified;
  if (!alreadyVerified) {
    user.isEmailVerified = true;
    await user.save();

    const { subject, html } = welcomeEmail();
    await sendMail({ to: user.email, subject, html });
  }

  const role = isAdminUser(user) ? "admin" : user.role;
  const token = signToken({ ...user.toJSON(), role });

  await linkEnrollmentsForUser(user);

  return {
    status: 200,
    body: {
      success: true,
      alreadyVerified,
      message: alreadyVerified
        ? "Email already verified. You are signed in."
        : "Email verified successfully! You are now signed in.",
      token,
      user: {
        id: user.id,
        _id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: true,
        role,
      },
    },
  };
};

const resendVerification = async ({ email }) => {
  if (!email) {
    return { status: 400, body: { error: "Email is required" } };
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    return {
      status: 200,
      body: {
        success: true,
        emailSent: true,
        message: "If the email exists, a verification link has been sent.",
      },
    };
  }

  if (user.isEmailVerified) {
    return { status: 400, body: { error: "Email is already verified" } };
  }

  const rawToken = user.createEmailVerificationToken();
  await user.save();

  const mail = await sendVerificationEmail(user.email, rawToken);

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      message: mail.message,
    },
  };
};

const forgotPassword = async ({ email }) => {
  if (!email) {
    return { status: 400, body: { error: "Email is required" } };
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    return {
      status: 200,
      body: {
        success: true,
        emailSent: true,
        message: "If the email exists, a reset link has been sent.",
      },
    };
  }

  const rawToken = user.createPasswordResetToken();
  await user.save();

  const mail = await sendPasswordResetEmail(user.email, rawToken);

  return {
    status: 200,
    body: {
      success: true,
      emailSent: mail.ok,
      message: mail.ok
        ? "If the email exists, a reset link has been sent."
        : mail.message,
    },
  };
};

const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    return { status: 400, body: { error: "Token and new password are required" } };
  }

  if (password.length < 6) {
    return { status: 400, body: { error: "Password must be at least 6 characters" } };
  }

  const user = await User.scope("withPassword").findOne({
    where: {
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return { status: 400, body: { error: "Invalid or expired reset link" } };
  }

  user.password = password;
  user.isEmailVerified = true;
  user.clearResetToken();
  user.clearVerificationToken();
  await user.save();

  return {
    status: 200,
    body: {
      success: true,
      message: "Password reset successfully! You can now sign in.",
      email: user.email,
    },
  };
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
