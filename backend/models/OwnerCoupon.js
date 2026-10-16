const mongoose = require("mongoose");

const ownerCouponSchema = new mongoose.Schema({
  // Owner Reference
  ownerPhone: { type: String, required: true, index: true },
  ownerName: { type: String, required: true },
  
  // Coupon Details
  title: { type: String, required: true },
  description: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  
  // Discount & Pricing
  discount: { type: Number, required: true }, // Percentage
  price: { type: Number, required: true }, // Price to unlock coupon
  
  // Validity
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  
  // Usage Stats
  totalPurchases: { type: Number, default: 0 },
  totalRedemptions: { type: Number, default: 0 },
  
  // Coupon Status
  status: {
    type: String,
    enum: ['active', 'expired', 'paused', 'archived'],
    default: 'active'
  },
  
  // Business Info
  businessName: String,
  businessType: String,
  businessLocation: String,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OwnerCoupon", ownerCouponSchema);
