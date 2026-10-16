const mongoose = require("mongoose");

const purchasedCouponSchema = new mongoose.Schema({
  citizenPhone: { type: String, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
  purchasedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PurchasedCoupon", purchasedCouponSchema);
