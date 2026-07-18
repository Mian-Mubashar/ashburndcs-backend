"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("class_schedules", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      courseId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "courses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      startTime: { type: Sequelize.STRING(50), allowNull: false },
      endTime: { type: Sequelize.STRING(50), allowNull: false },
      instructor: { type: Sequelize.STRING(191), allowNull: false },
      meetingLink: { type: Sequelize.STRING(500), allowNull: false, defaultValue: "" },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("class_schedules");
  },
};
