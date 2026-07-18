"use strict";

module.exports = (sequelize, DataTypes) => {
  const ScheduleStudent = sequelize.define(
    "ScheduleStudent",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      scheduleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "schedule_students", timestamps: true }
  );

  return ScheduleStudent;
};
