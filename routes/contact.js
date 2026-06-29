const express = require("express");
const Contact = require("../models/Contact");
const { sendMail, getAdminNotifyEmail } = require("../utils/mailer");
const { adminContactFormEmail } = require("../utils/emailTemplates");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required", success: false });
    }

    await Contact.create({ name, email, phone, subject, message });

    const { subject: mailSubject, html } = adminContactFormEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    const mailResult = await sendMail({
      to: getAdminNotifyEmail(),
      subject: mailSubject,
      replyTo: email,
      html,
    });
    if (!mailResult.ok) {
      console.error("Contact email failed:", mailResult.error);
      return res.status(503).json({
        success: false,
        error: "Message saved but email could not be sent. Please try WhatsApp or call us directly.",
      });
    }

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Failed to send message", success: false });
  }
});

module.exports = router;
