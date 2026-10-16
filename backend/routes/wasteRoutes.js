const express = require("express");
const WasteCollection = require("../models/wasteCollection");
const Citizen = require("../models/Citizen");
const Worker = require("../models/Worker");

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { phone, weight, wasteType, state, district, taluka, village, area, earning } = req.body;

    // Validate weight is greater than 0
    if (!weight || weight <= 0) {
      return res.status(400).json({ message: "Weight must be greater than 0" });
    }

    // Check if user is a worker - workers cannot submit waste collections
    const worker = await Worker.findOne({ phone });
    if (worker) {
      return res.status(403).json({ message: "Workers cannot submit waste collections" });
    }

    const qrCode = `${phone}-${Date.now()}`;
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

    const wasteEntry = await WasteCollection.create({
      userId: phone,
      phone,
      weight,
      wasteType,
      state,
      district,
      taluka,
      village,
      area,
      earning,
      status: 'pending',
      qrCode,
      verificationCode
    });

    res.status(201).json({ message: "Waste collection submitted", data: wasteEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/history/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const history = await WasteCollection.find({ phone }).sort({ date: -1 });
    res.status(200).json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { verificationCode, workerPhone } = req.body;

    const worker = await Worker.findOne({ phone: workerPhone });
    if (!worker) {
      return res.status(403).json({ message: "Access denied. Worker role required." });
    }

    const wasteEntry = await WasteCollection.findOne({ verificationCode, status: 'pending' });
    if (!wasteEntry) {
      return res.status(404).json({ message: "Invalid or already verified code" });
    }

    wasteEntry.status = 'verified';
    wasteEntry.verifiedBy = workerPhone;
    await wasteEntry.save();

    // Update citizen wallet and CI points
    const ciPointsEarned = Math.floor(wasteEntry.earning / 3);
    await Citizen.findOneAndUpdate(
      { phone: wasteEntry.phone },
      { 
        $inc: { 
          walletBalance: wasteEntry.earning,
          ciPoints: ciPointsEarned,
          totalWasteVerified: wasteEntry.weight
        } 
      }
    );

    // Calculate total verifications for work score
    const totalVerifications = await WasteCollection.countDocuments({ verifiedBy: workerPhone });
    
    // Update worker's work score to match total verifications
    await Worker.findOneAndUpdate(
      { phone: workerPhone },
      { $set: { workScore: totalVerifications } }
    );

    res.status(200).json({ message: "Waste collection verified", data: wasteEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/worker-stats/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    
    const worker = await Worker.findOne({ phone });
    if (!worker) {
      return res.status(403).json({ message: "Access denied. Worker role required." });
    }

    const verifications = await WasteCollection.find({ verifiedBy: phone }).sort({ date: -1 });
    const totalVerifications = verifications.length;
    const totalWasteProcessed = verifications.reduce((sum, item) => sum + item.weight, 0);
    
    // Work score equals total number of waste collection requests completed
    const workScore = totalVerifications;
    
    // Update worker's work score in database to match actual verifications
    if (worker.workScore !== workScore) {
      await Worker.findOneAndUpdate(
        { phone },
        { $set: { workScore: workScore } }
      );
    }
    
    res.status(200).json({ 
      verifications, 
      stats: { totalVerifications, totalWasteProcessed, workScore }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
