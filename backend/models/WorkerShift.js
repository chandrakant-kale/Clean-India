const mongoose = require("mongoose");

const workerShiftSchema = new mongoose.Schema({
  // Worker Reference
  workerPhone: { type: String, required: true, index: true },
  
  // Shift Timing
  shiftStartTime: { type: Date, required: true },
  shiftEndTime: { type: Date, sparse: true },
  shiftDuration: { type: Number, default: 0 }, // In hours
  
  // Shift Status
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Shift Performance
  verificationsCompleted: { type: Number, default: 0 },
  totalWasteProcessed: { type: Number, default: 0 }, // In kg
  
  // Location
  shiftLocation: String,
  district: String,
  taluka: String,
  
  // Earnings
  shiftEarnings: { type: Number, default: 0 },
  
  // Notes
  notes: { type: String, sparse: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WorkerShift", workerShiftSchema);
