"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("course_materials", {
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
      type: {
        type: Sequelize.ENUM("video", "document", "assignment"),
        allowNull: false,
      },
      url: { type: Sequelize.STRING(1000), allowNull: false, defaultValue: "" },
      fileUrl: { type: Sequelize.STRING(500), allowNull: false, defaultValue: "" },
      fileName: { type: Sequelize.STRING(255), allowNull: false, defaultValue: "" },
      content: { type: Sequelize.TEXT, allowNull: true },
      order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
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
    await queryInterface.dropTable("course_materials");
  },
};
