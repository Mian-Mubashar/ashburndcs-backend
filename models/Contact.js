"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(191), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false },
      phone: { type: DataTypes.STRING(50), allowNull: false },
      subject: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: "contacts" }
  );

  withMongoId(Contact);
  return Contact;
};
