const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema({
  citizenPhone: { type: String, required: true },
  type: { type: String, required: true }, // 'cash' or 'coupon'
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  couponCode: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Redemption", redemptionSchema);
