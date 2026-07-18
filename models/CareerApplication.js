"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const CareerApplication = sequelize.define(
    "CareerApplication",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_name: { type: DataTypes.STRING(191), allowNull: false },
      user_email: { type: DataTypes.STRING(191), allowNull: false },
      user_phone: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "" },
      position: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: "career_applications" }
  );

  withMongoId(CareerApplication);
  return CareerApplication;
};
