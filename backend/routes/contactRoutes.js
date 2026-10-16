const express = require("express");
const Contact = require("../models/contact");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Your message was sent successfully",
    });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
