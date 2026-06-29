const mongoose = require("mongoose");

const getMongoUri = () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (uri) return uri;

  const dbName = process.env.DB_NAME || "ashburndcs";
  return `mongodb://127.0.0.1:27017/${dbName}`;
};

const connectDB = async () => {
  const uri = getMongoUri();
  const dbName = process.env.DB_NAME?.trim() || "ashburndcs";

  if (!process.env.MONGODB_URI?.trim()) {
    console.warn("[WARN] MONGODB_URI not set — using local fallback:", uri);
  }

  await mongoose.connect(uri, { dbName });
  console.log(`MongoDB connected → ${mongoose.connection.name}`);
};

module.exports = connectDB;
