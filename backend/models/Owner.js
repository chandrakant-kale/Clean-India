const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Location
  address: String,
  state: String,
  district: String,
  taluka: String,
  village: String,
  locationLocked: { type: Boolean, default: false },
  
  // Coupon Management
  totalCouponsCreated: { type: Number, default: 0 },
  activeCoupons: { type: Number, default: 0 },
  
  // Performance Metrics
  averageDiscount: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Owner", ownerSchema);
