const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true, trim: true },
    user_email: { type: String, required: true, trim: true, lowercase: true },
    user_phone: { type: String, trim: true, default: "" },
    position: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerApplication", careerApplicationSchema);
