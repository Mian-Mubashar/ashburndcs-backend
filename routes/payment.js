const express = require("express");
const Stripe = require("stripe");
const { Payment } = require("../models");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "usd",
      receipt_email: email || undefined,
      metadata: { email: email || "" },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ error: error.message || "Failed to create payment intent" });
  }
});

router.post("/myemail", async (req, res) => {
  try {
    const { email, amount, transaction } = req.body;

    if (!email || !amount || !transaction) {
      return res.status(400).json({ error: "Email, amount, and transaction are required" });
    }

    await Payment.create({
      email,
      amount: Number(amount),
      transactionId: transaction,
    });

    await sendMail({
      subject: `Payment Confirmation — $${amount}`,
      replyTo: email,
      html: `
        <h2>Payment Successful</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Transaction ID:</strong> ${transaction}</p>
        <p>Thank you for your payment to ADCS Tech Solutions.</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Payment email error:", error);
    res.status(500).json({ error: "Failed to process payment notification" });
  }
});

module.exports = router;
