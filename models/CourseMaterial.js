const mongoose = require("mongoose");

const courseMaterialSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["video", "document", "assignment"], required: true },
    url: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    content: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseMaterial", courseMaterialSchema);
