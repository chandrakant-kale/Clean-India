const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  ownerPhone: { type: String, required: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true },
  discount: { type: Number, required: true },
  couponCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Coupon", couponSchema);
