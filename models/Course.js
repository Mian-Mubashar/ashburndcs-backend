"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      duration: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "" },
      level: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Beginner" },
      category: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Technology" },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "courses" }
  );

  Course.associate = (models) => {
    Course.hasMany(models.Enrollment, { foreignKey: "courseId", as: "enrollments" });
    Course.hasMany(models.ClassSchedule, { foreignKey: "courseId", as: "schedules" });
    Course.hasMany(models.CourseMaterial, { foreignKey: "courseId", as: "materials" });
    Course.belongsToMany(models.User, {
      through: models.UserCourse,
      foreignKey: "courseId",
      otherKey: "userId",
      as: "students",
    });
  };

  withMongoId(Course);
  return Course;
};
