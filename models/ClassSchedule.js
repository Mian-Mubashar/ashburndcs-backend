"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const ClassSchedule = sequelize.define(
    "ClassSchedule",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      startTime: { type: DataTypes.STRING(50), allowNull: false },
      endTime: { type: DataTypes.STRING(50), allowNull: false },
      instructor: { type: DataTypes.STRING(191), allowNull: false },
      meetingLink: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    },
    { tableName: "class_schedules" }
  );

  ClassSchedule.associate = (models) => {
    ClassSchedule.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    ClassSchedule.belongsToMany(models.User, {
      through: models.ScheduleStudent,
      foreignKey: "scheduleId",
      otherKey: "userId",
      as: "students",
    });
  };

  withMongoId(ClassSchedule);
  return ClassSchedule;
};
