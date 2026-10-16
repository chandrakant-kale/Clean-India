const mongoose = require("mongoose");

const wasteCollectionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    phone: { type: String, required: true },
    weight: { type: Number, required: true },
    wasteType: { type: String, required: true },
    state: { type: String },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    area: { type: String, required: true },
    earning: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
    qrCode: { type: String, required: true },
    verificationCode: { type: String, required: true },
    verifiedBy: { type: String }, // Worker phone who verified
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WasteCollection", wasteCollectionSchema);
