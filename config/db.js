const { sequelize } = require("../models");

const connectDB = async () => {
  await sequelize.authenticate();
  console.log(`MySQL connected → ${process.env.DB_NAME}`);
};

module.exports = connectDB;
