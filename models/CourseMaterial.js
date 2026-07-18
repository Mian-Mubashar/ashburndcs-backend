"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const CourseMaterial = sequelize.define(
    "CourseMaterial",
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
      type: {
        type: DataTypes.ENUM("video", "document", "assignment"),
        allowNull: false,
      },
      url: { type: DataTypes.STRING(1000), allowNull: false, defaultValue: "" },
      fileUrl: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
      fileName: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },
      content: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: "course_materials" }
  );

  CourseMaterial.associate = (models) => {
    CourseMaterial.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
  };

  withMongoId(CourseMaterial);
  return CourseMaterial;
};
