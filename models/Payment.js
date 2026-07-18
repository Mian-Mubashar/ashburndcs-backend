"use strict";

const { withMongoId } = require("../utils/modelHelpers");

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: { type: DataTypes.STRING(191), allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      transactionId: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "succeeded" },
    },
    { tableName: "payments" }
  );

  withMongoId(Payment);
  return Payment;
};
