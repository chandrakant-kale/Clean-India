const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
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
  
  // Work Status
  workStatus: {
    type: String,
    enum: ['on-work', 'not-in-work', 'leave'],
    default: 'not-in-work'
  },
  
  // Shift Tracking
  shiftStartTime: { type: Date, default: null },
  shiftEndTime: { type: Date, default: null },
  totalShiftHours: { type: Number, default: 0 },
  
  // Work Performance
  workScore: { type: Number, default: 0 },
  totalVerifications: { type: Number, default: 0 },
  
  // Rewards & Incentives
  walletBalance: { type: Number, default: 0 },
  
  // Performance Metrics
  averageVerificationsPerShift: { type: Number, default: 0 },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Worker", workerSchema);
