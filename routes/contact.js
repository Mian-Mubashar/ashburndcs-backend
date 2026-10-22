const express = require("express");
const { Contact } = require("../models");
const { sendMail, getAdminNotifyEmail } = require("../utils/mailer");
const {
  adminContactFormEmail,
  contactUserConfirmationEmail,
} = require("../utils/emailTemplates");

const router = express.Router();

/** Test endpoint to verify email delivery directly in browser */
router.get("/contact/test-mail", async (_req, res) => {
  const adminEmail = getAdminNotifyEmail();
  console.log(`[TEST-MAIL] Sending test email to: ${adminEmail}...`);
  const result = await sendMail({
    to: adminEmail,
    kind: "test-diagnostic",
    subject: "ADCS Test Email — Verification",
    html: `<h3>Test Email Successful!</h3><p>Your Nodemailer configuration is working properly and sending emails to Gmail.</p><p>Timestamp: ${new Date().toISOString()}</p>`,
  });

  console.log(`[TEST-MAIL] Result:`, result);
  res.json({
    adminEmail,
    mailResult: result,
  });
});

router.post(["/contact", "/contact/"], async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required", success: false });
    }

    const userEmail = String(email || "").trim().toLowerCase();
    const adminEmail = String(getAdminNotifyEmail() || "").toLowerCase();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[Contact] New submission received:");
    console.log(`  Name:    ${name}`);
    console.log(`  Email:   ${userEmail}`);
    console.log(`  Phone:   ${phone}`);
    console.log(`  Subject: ${subject}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // 1. Save to database
    const savedContact = await Contact.create({ name, email: userEmail, phone, subject, message });
    console.log(`[Contact] ✓ Saved in database with ID: ${savedContact.id}`);

    const payload = { name, email: userEmail, phone, subject, message };
    const adminMail = adminContactFormEmail(payload);
    const userMail = contactUserConfirmationEmail(payload);

    // 2. Send email to admin
    console.log(`[Contact] Sending admin notification to: ${adminEmail}...`);
    const adminResult = await sendMail({
      to: adminEmail,
      kind: "admin-details",
      subject: adminMail.subject,
      replyTo: userEmail,
      html: adminMail.html,
    });
    console.log(`[Contact] Admin email result:`, adminResult.ok ? "✓ SUCCESS" : `✗ FAILED (${adminResult.error})`);

    // 3. Send confirmation email to user
    let userResult = { ok: false, error: "User email matches admin inbox" };
    if (userEmail && userEmail !== adminEmail) {
      console.log(`[Contact] Sending confirmation email to user: ${userEmail}...`);
      userResult = await sendMail({
        to: userEmail,
        kind: "user-confirmation",
        subject: userMail.subject,
        html: userMail.html,
      });
      console.log(`[Contact] User email result:`, userResult.ok ? "✓ SUCCESS" : `✗ FAILED (${userResult.error})`);
    } else {
      console.log("[Contact] Skipped user confirmation — form email is the admin address");
    }

    if (!adminResult.ok) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("[Contact] ✗ ADMIN NOTIFICATION FAILED!");
      console.error(`  Admin Error: ${adminResult.error}`);
      console.error(`  User Confirmation: ${userResult.ok ? "sent" : userResult.error}`);
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      return res.status(503).json({
        success: false,
        error: "Your message was saved, but our team could not be notified. Please contact us by phone.",
      });
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[Contact] ✓ Form processed successfully and emails delivered!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

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
