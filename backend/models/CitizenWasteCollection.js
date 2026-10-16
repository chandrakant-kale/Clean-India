const mongoose = require("mongoose");

const citizenWasteCollectionSchema = new mongoose.Schema({
  // Citizen Reference
  citizenPhone: { type: String, required: true, index: true },
  
  // Waste Details
  weight: { type: Number, required: true },
  wasteType: {
    type: String,
    enum: ['Wet Waste', 'Dry Waste', 'Electronics Waste'],
    required: true
  },
  
  // Location
  state: String,
  district: String,
  taluka: String,
  village: String,
  area: String,
  
  // Verification
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: { type: String, sparse: true }, // Worker phone
  
  // QR Code & Verification Code
  qrCode: { type: String, unique: true, sparse: true },
  
  // Earnings
  earning: { type: Number, default: 0 },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CitizenWasteCollection", citizenWasteCollectionSchema);
