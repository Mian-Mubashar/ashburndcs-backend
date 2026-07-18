const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const required = ["DB_NAME", "DB_USER", "DB_HOST", "DB_PORT"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.warn(`[DB Config] Missing env keys: ${missing.join(", ")}`);
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    dialectOptions: {
      charset: "utf8mb4",
    },
    define: {
      underscored: false,
      timestamps: true,
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      charset: "utf8mb4",
    },
    define: {
      underscored: false,
      timestamps: true,
    },
  },
};
