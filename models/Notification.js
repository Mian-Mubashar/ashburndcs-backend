"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      type: {
        type: DataTypes.ENUM("schedule", "enrollment", "general"),
        allowNull: false,
        defaultValue: "general",
      },
      read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "notifications" }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  withMongoId(Notification);
  return Notification;
};
