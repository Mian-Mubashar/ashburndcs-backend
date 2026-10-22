const express = require("express");
const { CareerApplication } = require("../models");
const { sendMail, getAdminNotifyEmail } = require("../utils/mailer");
const {
  adminCareerApplicationEmail,
  careerApplicantEmail,
} = require("../utils/emailTemplates");

const router = express.Router();

router.post(["/career", "/career/"], async (req, res) => {
  try {
    const { user_name, user_email, user_phone, position, message } = req.body;

    if (!user_name || !user_email || !position || !message) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    await CareerApplication.create({
      user_name,
      user_email,
      user_phone: user_phone || "",
      position,
      message,
    });

    const applicantEmail = String(user_email || "").trim().toLowerCase();
    const payload = { user_name, user_email: applicantEmail, user_phone, position, message };
    const adminEmail = String(getAdminNotifyEmail() || "").toLowerCase();
    const adminMail = adminCareerApplicationEmail(payload);
    const applicantMail = careerApplicantEmail(payload);

    console.log(`[Career] Split: admin=${adminEmail} | applicant=${applicantEmail}`);

    const adminResult = await sendMail({
      to: adminEmail,
      kind: "admin-details",
      subject: adminMail.subject,
      replyTo: applicantEmail,
      html: adminMail.html,
    });

    let applicantResult = { ok: false, error: "Applicant email matches admin inbox" };
    if (applicantEmail && applicantEmail !== adminEmail) {
      applicantResult = await sendMail({
        to: applicantEmail,
        kind: "applicant-confirmation",
        subject: applicantMail.subject,
        html: applicantMail.html,
      });
    } else {
      console.error(
        "[Career] Skipped applicant confirmation — form email is the admin address"
      );
    }

    if (!adminResult.ok) {
      console.error("Career admin email failed:", adminResult.error);
    }
    if (!applicantResult.ok) {
      console.error("Career applicant email failed:", applicantResult.error);
    }

    if (!adminResult.ok && !applicantResult.ok) {
      return res.status(503).json({
        success: false,
        error: "Application saved but emails could not be sent. Please try again or call us.",
      });
    }

    res.json({
      success: true,
      message: "Application submitted successfully",
      confirmationSentTo: applicantResult.ok ? applicantEmail : null,
      adminNotified: adminResult.ok,
    });
  } catch (error) {
    console.error("Career error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

module.exports = router;
