const express = require("express");
const Coupon = require("../models/Coupon");
const PurchasedCoupon = require("../models/PurchasedCoupon");
const Redemption = require("../models/Redemption");
const Citizen = require("../models/Citizen");

const router = express.Router();

// Create coupon
router.post("/create", async (req, res) => {
  try {
    const { ownerPhone, ownerName, title, discount, couponCode, description, price, validUntil } = req.body;

    const existingCoupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      ownerPhone,
      ownerName,
      title,
      discount,
      couponCode: couponCode.toUpperCase(),
      description,
      price: price || 0,
      validUntil,
      isActive: new Date(validUntil) > new Date()
    });

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get owner coupons
router.get("/owner/:phone", async (req, res) => {
  try {
    const coupons = await Coupon.find({ ownerPhone: req.params.phone }).sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all active coupons
router.get("/active", async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true,
      validUntil: { $gte: new Date() }
    }).sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete coupon
router.delete("/delete/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Coupon deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Purchase coupon
router.post("/purchase", async (req, res) => {
  try {
    const { citizenPhone, couponId } = req.body;

    if (!citizenPhone || !couponId) {
      return res.status(400).json({ message: "Phone and coupon ID required" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const citizen = await Citizen.findOne({ phone: citizenPhone });
    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    // Check if citizen has sufficient balance
    if (citizen.walletBalance < coupon.price) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const alreadyPurchased = await PurchasedCoupon.findOne({ citizenPhone, couponId });
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Coupon already purchased" });
    }

    // Create purchased coupon record
    await PurchasedCoupon.create({ citizenPhone, couponId });
    
    // Deduct from wallet balance
    const updatedCitizen = await Citizen.findOneAndUpdate(
      { phone: citizenPhone },
      { $inc: { walletBalance: -coupon.price } },
      { new: true }
    );

    // Record redemption
    await Redemption.create({
      citizenPhone,
      type: 'coupon',
      item: coupon.title,
      amount: coupon.price,
      couponId,
      couponCode: coupon.couponCode,
      status: 'completed'
    });

    res.status(200).json({ 
      message: "Coupon purchased successfully", 
      coupon,
      newWalletBalance: updatedCitizen.walletBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get purchased coupons
router.get("/purchased/:phone", async (req, res) => {
  try {
    const purchased = await PurchasedCoupon.find({ citizenPhone: req.params.phone }).populate("couponId");
    const couponIds = purchased.map(p => p.couponId._id.toString());
    res.status(200).json({ couponIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Record cash redemption
router.post("/redeem-cash", async (req, res) => {
  try {
    const { citizenPhone, amount, item } = req.body;

    if (!citizenPhone || !amount || !item) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const citizen = await Citizen.findOne({ phone: citizenPhone });
    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    // Check if citizen has sufficient balance
    if (citizen.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct from wallet balance
    const updatedCitizen = await Citizen.findOneAndUpdate(
      { phone: citizenPhone },
      { $inc: { walletBalance: -amount } },
      { new: true }
    );

    // Record redemption
    const redemption = await Redemption.create({
      citizenPhone,
      type: 'cash',
      item,
      amount,
      status: 'completed'
    });

    res.status(201).json({ 
      message: "Cash redemption recorded", 
      redemption,
      newWalletBalance: updatedCitizen.walletBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get redemption history
router.get("/history/:phone", async (req, res) => {
  try {
    const history = await Redemption.find({ citizenPhone: req.params.phone })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
