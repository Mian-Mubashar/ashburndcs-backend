const express = require("express");
const { Contact } = require("../models");
const { sendMail, getAdminNotifyEmail } = require("../utils/mailer");
const {
  adminContactFormEmail,
  contactUserConfirmationEmail,
} = require("../utils/emailTemplates");

const router = express.Router();


router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required", success: false });
    }

    const userEmail = String(email || "").trim().toLowerCase();
    const adminEmail = String(getAdminNotifyEmail() || "").toLowerCase();

    await Contact.create({ name, email: userEmail, phone, subject, message });

    const payload = { name, email: userEmail, phone, subject, message };
    const adminMail = adminContactFormEmail(payload);
    const userMail = contactUserConfirmationEmail(payload);

    console.log(`[Contact] Split: admin=${adminEmail} | user=${userEmail}`);

    const adminResult = await sendMail({
      to: adminEmail,
      kind: "admin-details",
      subject: adminMail.subject,
      replyTo: userEmail,
      html: adminMail.html,
    });

    let userResult = { ok: false, error: "User email matches admin inbox" };
    if (userEmail && userEmail !== adminEmail) {
      userResult = await sendMail({
        to: userEmail,
        kind: "user-confirmation",
        subject: userMail.subject,
        html: userMail.html,
      });
    } else {
      console.error("[Contact] Skipped user confirmation — form email is the admin address");
    }

    if (!adminResult.ok) {
      console.error("Contact admin email failed:", adminResult.error);
    }
    if (!userResult.ok) {
      console.error("Contact user email failed:", userResult.error);
    }

    if (!adminResult.ok && !userResult.ok) {
      return res.status(503).json({
        success: false,
        error: "Message saved but emails could not be sent. Please try WhatsApp or call us directly.",
      });
    }

    res.json({
      success: true,
      message: "Message sent successfully",
      confirmationSentTo: userResult.ok ? userEmail : null,
      adminNotified: adminResult.ok,
    });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Failed to send message", success: false });
  }
});

module.exports = router;
