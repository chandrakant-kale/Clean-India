const mongoose = require("mongoose");

const workerVerificationSchema = new mongoose.Schema({
  // Worker Reference
  workerPhone: { type: String, required: true, index: true },
  
  // Waste Collection Reference
  wasteCollectionId: { type: mongoose.Schema.Types.ObjectId, ref: "CitizenWasteCollection", required: true },
  verificationCode: { type: String, required: true },
  
  // Citizen Reference
  citizenPhone: { type: String, required: true },
  
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
  
  // Verification Details
  status: {
    type: String,
    enum: ['verified', 'rejected'],
    default: 'verified'
  },
  
  // Shift Information
  shiftDate: { type: Date, default: Date.now },
  
  // Earnings Impact
  citizenEarning: { type: Number, required: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WorkerVerification", workerVerificationSchema);
