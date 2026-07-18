"use strict";

const { withMongoId, createHashedToken } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: { type: DataTypes.STRING(191), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false },
      phone: { type: DataTypes.STRING(50), allowNull: false },
      education: { type: DataTypes.STRING(255), allowNull: false },
      courseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "courseId",
      },
      message: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      registrationToken: { type: DataTypes.STRING(255), allowNull: true },
      registrationExpires: { type: DataTypes.DATE, allowNull: true },
      adminNote: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    },
    { tableName: "enrollments" }
  );

  Enrollment.prototype.createRegistrationToken = function createRegistrationToken() {
    const { token, hashed, expires } = createHashedToken(7 * 24 * 60 * 60 * 1000);
    this.registrationToken = hashed;
    this.registrationExpires = expires;
    return token;
  };

  Enrollment.prototype.clearRegistrationToken = function clearRegistrationToken() {
    this.registrationToken = null;
    this.registrationExpires = null;
  };

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    Enrollment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  withMongoId(Enrollment);
  return Enrollment;
};
