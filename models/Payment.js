const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, trim: true },
    status: { type: String, default: "succeeded" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
