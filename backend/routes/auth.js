const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.status(200).json({
      message: "Login successful",
      name: user.name,
      phone: user.phone,
      role: user.role,
      rewards: user.rewards,
      walletBalance: user.walletBalance,
      workStatus: user.workStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/work-status", async (req, res) => {
  try {
    const { phone, workStatus } = req.body;

    if (!phone || !workStatus) {
      return res.status(400).json({ message: "Phone and work status required" });
    }

    if (!['on-work', 'not-in-work', 'leave'].includes(workStatus)) {
      return res.status(400).json({ message: "Invalid work status" });
    }

    const user = await User.findOneAndUpdate(
      { phone },
      { workStatus },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Work status updated", workStatus: user.workStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/workers", async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select("-password");
    
    const stats = {
      total: workers.length,
      working: workers.filter(w => w.workStatus === 'on-work').length,
      onLeave: workers.filter(w => w.workStatus === 'leave').length,
      notWorking: workers.filter(w => w.workStatus === 'not-in-work').length
    };

    res.status(200).json({ workers, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
