"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define(
    "UserCourse",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "user_courses", timestamps: true }
  );

  return UserCourse;
};
