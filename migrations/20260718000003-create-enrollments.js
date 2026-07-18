"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("enrollments", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: { type: Sequelize.STRING(191), allowNull: false },
      email: { type: Sequelize.STRING(191), allowNull: false },
      phone: { type: Sequelize.STRING(50), allowNull: false },
      education: { type: Sequelize.STRING(255), allowNull: false },
      courseId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "courses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      message: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      registrationToken: { type: Sequelize.STRING(255), allowNull: true },
      registrationExpires: { type: Sequelize.DATE, allowNull: true },
      adminNote: { type: Sequelize.TEXT, allowNull: true },
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

    await queryInterface.addIndex("enrollments", ["email"]);
    await queryInterface.addIndex("enrollments", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("enrollments");
  },
};
