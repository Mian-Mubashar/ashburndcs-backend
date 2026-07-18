"use strict";

const bcrypt = require("bcryptjs");
const {
  withMongoId,
  verifyExpiryMs,
  resetExpiryMs,
  createHashedToken,
} = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("student", "admin"),
        allowNull: false,
        defaultValue: "student",
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
          if (user.email) user.email = user.email.toLowerCase().trim();
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
          if (user.changed("email") && user.email) {
            user.email = user.email.toLowerCase().trim();
          }
        },
      },
    }
  );

  User.prototype.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  };

  User.prototype.createEmailVerificationToken = function createEmailVerificationToken() {
    const { token, hashed, expires } = createHashedToken(verifyExpiryMs());
    this.emailVerificationToken = hashed;
    this.emailVerificationExpires = expires;
    return token;
  };

  User.prototype.createPasswordResetToken = function createPasswordResetToken() {
    const { token, hashed, expires } = createHashedToken(resetExpiryMs());
    this.resetPasswordToken = hashed;
    this.resetPasswordExpires = expires;
    return token;
  };

  User.prototype.clearVerificationToken = function clearVerificationToken() {
    this.emailVerificationToken = null;
    this.emailVerificationExpires = null;
  };

  User.prototype.clearResetToken = function clearResetToken() {
    this.resetPasswordToken = null;
    this.resetPasswordExpires = null;
  };

  User.associate = (models) => {
    User.belongsToMany(models.Course, {
      through: models.UserCourse,
      foreignKey: "userId",
      otherKey: "courseId",
      as: "enrolledCourses",
    });
    User.hasMany(models.Enrollment, { foreignKey: "userId", as: "enrollments" });
    User.hasMany(models.Notification, { foreignKey: "userId", as: "notifications" });
    User.belongsToMany(models.ClassSchedule, {
      through: models.ScheduleStudent,
      foreignKey: "userId",
      otherKey: "scheduleId",
      as: "schedules",
    });
  };

  withMongoId(User);
  return User;
};
