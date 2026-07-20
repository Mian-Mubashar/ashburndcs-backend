const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/** Hostinger env UI often stores quotes as part of the value — strip them. */
const cleanEnv = (value) => {
  if (value == null) return value;
  let v = String(value).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v.trim();
};

/** Prefer IPv4 loopback — `localhost` can resolve to ::1 and Hostinger may deny it. */
const resolveDbHost = (host) => {
  const h = cleanEnv(host) || "127.0.0.1";
  if (h === "localhost" || h === "::1") return "127.0.0.1";
  return h;
};

const dbUser = cleanEnv(process.env.DB_USER);
const dbPassword = cleanEnv(process.env.DB_PASSWORD) ?? "";
const dbName = cleanEnv(process.env.DB_NAME);
const dbHost = resolveDbHost(process.env.DB_HOST);
const dbPort = Number(cleanEnv(process.env.DB_PORT) || 3306);
const dbDialect = cleanEnv(process.env.DB_DIALECT) || "mysql";

const required = ["DB_NAME", "DB_USER", "DB_HOST", "DB_PORT"];
const missing = required.filter((key) => !cleanEnv(process.env[key]));
if (missing.length) {
  console.warn(`[DB Config] Missing env keys: ${missing.join(", ")}`);
}

const base = {
  username: dbUser,
  password: dbPassword,
  database: dbName,
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  dialectOptions: {
    charset: "utf8mb4",
  },
  define: {
    underscored: false,
    timestamps: true,
  },
};

module.exports = {
  development: {
    ...base,
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  },
  test: {
    ...base,
    database: cleanEnv(process.env.DB_NAME_TEST) || `${dbName}_test`,
    logging: false,
  },
  production: {
    ...base,
    logging: false,
  },
};
