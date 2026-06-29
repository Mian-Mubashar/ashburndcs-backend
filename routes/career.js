const express = require("express");
const CareerApplication = require("../models/CareerApplication");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

router.post("/career", async (req, res) => {
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

    await sendMail({
      subject: `Career Application: ${position}`,
      replyTo: user_email,
      html: `
        <h2>New Career Application</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Phone:</strong> ${user_phone || "N/A"}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Career error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

module.exports = router;
