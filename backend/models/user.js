const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    district: String,
    taluka: String,
    village: String,
    locationLocked: { type: Boolean, default: false },
    rewards: { type: Number, default: 0 },
    role: { type: String, default: "citizen" },
    walletBalance: {
        type: Number,
        default: 0
    },
    workScore: {
        type: Number,
        default: 0
    },
    workStatus: {
        type: String,
        enum: ['on-work', 'not-in-work', 'leave'],
        default: null,
        sparse: true
    },
    shiftStartTime: { type: Date, default: null },
    shiftEndTime: { type: Date, default: null },
    totalShiftHours: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);
