const mongoose = require("mongoose");

const citizenRedemptionSchema = new mongoose.Schema({
  // Citizen Reference
  citizenPhone: { type: String, required: true, index: true },
  
  // Redemption Type
  type: {
    type: String,
    enum: ['cash', 'coupon'],
    required: true
  },
  
  // Redemption Details
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  
  // Coupon Specific
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "OwnerCoupon", sparse: true },
  couponCode: { type: String, sparse: true },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // Transaction Details
  transactionId: { type: String, unique: true, sparse: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CitizenRedemption", citizenRedemptionSchema);
