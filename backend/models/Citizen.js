const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, sparse: true },
  
  // Location
  address: String,
  city: String,
  state: String,
  district: String,
  taluka: String,
  village: String,
  locationLocked: { type: Boolean, default: false },
  
  // Wallet & Rewards
  walletBalance: { type: Number, default: 0 },
  ciPoints: { type: Number, default: 0 },
  
  // Waste Collection Stats
  totalWasteSubmitted: { type: Number, default: 0 },
  totalWasteVerified: { type: Number, default: 0 },
  
  // Redemption Stats
  totalRedemptions: { type: Number, default: 0 },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Citizen", citizenSchema);
