const express = require("express");
const bcrypt = require("bcrypt");
const Citizen = require("../models/Citizen");
const Worker = require("../models/Worker");
const Owner = require("../models/Owner");
const OTP = require("../models/OTP");
const WasteCollection = require("../models/wasteCollection");
const WorkerShift = require("../models/WorkerShift");

const router = express.Router();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate SMS sending (replace with actual SMS service)
function sendSMS(phone, otp) {
  console.log(`SMS sent to ${phone}: Your OTP is ${otp}`);
  return true;
}

// Check if phone exists in any collection
async function phoneExistsInAnyRole(phone) {
  const citizen = await Citizen.findOne({ phone });
  const worker = await Worker.findOne({ phone });
  const owner = await Owner.findOne({ phone });
  
  if (citizen) return { exists: true, role: 'citizen' };
  if (worker) return { exists: true, role: 'worker' };
  if (owner) return { exists: true, role: 'owner' };
  
  return { exists: false, role: null };
}

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: "Valid 10-digit phone number required" });
    }

    // Check if user already exists in any collection
    const phoneCheck = await phoneExistsInAnyRole(phone);
    if (phoneCheck.exists) {
      return res.status(400).json({ 
        message: `This phone number is already registered as a ${phoneCheck.role}. Please use a different number or login with your existing account.` 
      });
    }

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to database
    await OTP.create({
      phone,
      otp,
      expiresAt
    });

    // Send OTP via SMS (simulated)
    const smsSent = sendSMS(phone, otp);
    
    if (smsSent) {
      res.status(200).json({ 
        message: "OTP sent successfully",
        expiresIn: 300 // 5 minutes in seconds
      });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      phone, 
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ 
      message: "OTP verified successfully",
      verified: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check in all collections
    let user = await Citizen.findOne({ phone });
    let role = "citizen";

    if (!user) {
      user = await Worker.findOne({ phone });
      role = "worker";
    }

    if (!user) {
      user = await Owner.findOne({ phone });
      role = "owner";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.status(200).json({
      message: "Login successful",
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: role,
      walletBalance: user.walletBalance,
      workStatus: user.workStatus || null,
      locationLocked: user.locationLocked,
      state: user.state,
      district: user.district,
      taluka: user.taluka,
      village: user.village
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER CITIZEN
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, address, state, district, taluka, village } = req.body;

    // Check if OTP was verified
    const verifiedOTP = await OTP.findOne({ 
      phone, 
      verified: true,
      expiresAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // Allow 10 minutes after verification
    });

    if (!verifiedOTP) {
      return res.status(400).json({ message: "Please verify your phone number with OTP first" });
    }

    // Check if phone exists in any role
    const phoneCheck = await phoneExistsInAnyRole(phone);
    if (phoneCheck.exists) {
      return res.status(400).json({ 
        message: `This phone number is already registered as a ${phoneCheck.role}. Please use a different number.` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const citizen = await Citizen.create({
      name,
      phone,
      password: hashedPassword,
      address,
      state,
      district,
      taluka,
      village,
      locationLocked: true
    });

    // Clean up OTP records for this phone
    await OTP.deleteMany({ phone });

    res.status(201).json({
      message: "Citizen registered successfully",
      userId: citizen._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER WORKER
router.post("/register-worker", async (req, res) => {
  try {
    const { name, phone, password, address, state, district, taluka, village } = req.body;

    // Check if OTP was verified
    const verifiedOTP = await OTP.findOne({ 
      phone, 
      verified: true,
      expiresAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // Allow 10 minutes after verification
    });

    if (!verifiedOTP) {
      return res.status(400).json({ message: "Please verify your phone number with OTP first" });
    }

    // Check if phone exists in any role
    const phoneCheck = await phoneExistsInAnyRole(phone);
    if (phoneCheck.exists) {
      return res.status(400).json({ 
        message: `This phone number is already registered as a ${phoneCheck.role}. Please use a different number.` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      name,
      phone,
      password: hashedPassword,
      address,
      state,
      district,
      taluka,
      village,
      workStatus: "not-in-work",
      locationLocked: true
    });

    // Clean up OTP records for this phone
    await OTP.deleteMany({ phone });

    res.status(201).json({
      message: "Worker registered successfully",
      userId: worker._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER OWNER
router.post("/register-owner", async (req, res) => {
  try {
    const { name, phone, email, password, address, state, district, taluka, village } = req.body;

    // Check if OTP was verified
    const verifiedOTP = await OTP.findOne({ 
      phone, 
      verified: true,
      expiresAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // Allow 10 minutes after verification
    });

    if (!verifiedOTP) {
      return res.status(400).json({ message: "Please verify your phone number with OTP first" });
    }

    // Check if phone exists in any role
    const phoneCheck = await phoneExistsInAnyRole(phone);
    if (phoneCheck.exists) {
      return res.status(400).json({ 
        message: `This phone number is already registered as a ${phoneCheck.role}. Please use a different number.` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      name,
      phone,
      email,
      password: hashedPassword,
      address,
      state,
      district,
      taluka,
      village,
      locationLocked: true
    });

    // Clean up OTP records for this phone
    await OTP.deleteMany({ phone });

    res.status(201).json({
      message: "Owner registered successfully",
      userId: owner._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER PROFILE
router.get("/profile/:phone", async (req, res) => {
  try {
    const { phone } = req.params;

    // Check in all collections
    let user = await Citizen.findOne({ phone }).select("-password");
    let role = "citizen";

    if (!user) {
      user = await Worker.findOne({ phone }).select("-password");
      role = "worker";
    }

    if (!user) {
      user = await Owner.findOne({ phone }).select("-password");
      role = "owner";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile fetched successfully",
      user: { ...user.toObject(), role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE WORK STATUS
router.patch("/work-status", async (req, res) => {
  try {
    const { phone, workStatus } = req.body;

    if (!phone || !workStatus) {
      return res.status(400).json({ message: "Phone and work status required" });
    }

    if (!['on-work', 'not-in-work', 'leave'].includes(workStatus)) {
      return res.status(400).json({ message: "Invalid work status" });
    }

    const worker = await Worker.findOneAndUpdate(
      { phone },
      { workStatus },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Work status updated", workStatus: worker.workStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL WORKERS
router.get("/workers", async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");
    
    const stats = {
      total: workers.length,
      working: workers.filter(w => w.workStatus === 'on-work').length,
      onLeave: workers.filter(w => w.workStatus === 'leave').length,
      notWorking: workers.filter(w => w.workStatus === 'not-in-work').length
    };

    res.status(200).json({ workers, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET WORKER DETAIL WITH STATISTICS
router.get("/workers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Get waste collections verified by this worker
    const collections = await WasteCollection.find({ verifiedBy: worker.phone });
    
    // Calculate last month's working hours from WorkerShift records
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    // Get all completed shifts from last month
    const lastMonthShifts = await WorkerShift.find({
      workerPhone: worker.phone,
      status: 'completed',
      shiftStartTime: {
        $gte: lastMonthStart,
        $lte: lastMonthEnd
      }
    });
    
    // Calculate metrics
    let lastMonthTotalHours = 0;
    const workingDaysSet = new Set();
    
    lastMonthShifts.forEach(shift => {
      lastMonthTotalHours += shift.shiftDuration || 0;
      const shiftDate = new Date(shift.shiftStartTime).toDateString();
      workingDaysSet.add(shiftDate);
    });
    
    const lastMonthWorkingDays = workingDaysSet.size;
    const lastMonthAvgDailyHours = lastMonthWorkingDays > 0 ? lastMonthTotalHours / lastMonthWorkingDays : 0;
    
    const stats = {
      totalCollections: collections.length,
      totalWeight: collections.reduce((sum, c) => sum + (c.weight || 0), 0),
      verifiedCollections: collections.filter(c => c.status === 'verified').length,
      pendingCollections: collections.filter(c => c.status === 'pending').length,
      lastCollectionDate: collections.length > 0 ? collections[collections.length - 1].createdAt : null,
      lastMonthTotalHours: parseFloat(lastMonthTotalHours.toFixed(2)),
      lastMonthWorkingDays: lastMonthWorkingDays,
      lastMonthAvgDailyHours: parseFloat(lastMonthAvgDailyHours.toFixed(2))
    };

    res.status(200).json({ 
      worker, 
      stats,
      recentCollections: collections.slice(-10).reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE
router.put("/profile/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, state, district, taluka, village } = req.body;

    // Check in all collections
    let user = await Citizen.findOne({ phone });
    let collection = Citizen;

    if (!user) {
      user = await Worker.findOne({ phone });
      collection = Worker;
    }

    if (!user) {
      user = await Owner.findOne({ phone });
      collection = Owner;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if location is locked
    if (user.locationLocked && (state || district || taluka || village)) {
      return res.status(403).json({ message: "Location is locked and cannot be changed" });
    }

    const updatedUser = await collection.findOneAndUpdate(
      { phone },
      { name, state, district, taluka, village },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE LOCATION (Unlock and change location)
router.put("/location/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { state, district, taluka, village } = req.body;

    if (!state || !district || !taluka || !village) {
      return res.status(400).json({ message: "All location fields required" });
    }

    // Check in all collections
    let user = await Citizen.findOne({ phone });
    let collection = Citizen;

    if (!user) {
      user = await Worker.findOne({ phone });
      collection = Worker;
    }

    if (!user) {
      user = await Owner.findOne({ phone });
      collection = Owner;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update location and lock it again
    const updatedUser = await collection.findOneAndUpdate(
      { phone },
      { 
        state, 
        district, 
        taluka, 
        village,
        locationLocked: true
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ 
      message: "Location updated and locked successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE WORKER PROFILE
router.put("/workers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, workStatus, workScore, state, district, taluka, village } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      id,
      { name, workStatus, workScore, state, district, taluka, village },
      { new: true }
    ).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker profile updated successfully", worker });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// START SHIFT
router.post("/shift/start", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const worker = await Worker.findOne({ phone });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const now = new Date();
    const worker_updated = await Worker.findOneAndUpdate(
      { phone },
      { 
        shiftStartTime: now,
        shiftEndTime: null,
        workStatus: 'on-work'
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ 
      message: "Shift started",
      shiftStartTime: worker_updated.shiftStartTime,
      workStatus: worker_updated.workStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// END SHIFT
router.post("/shift/end", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const worker = await Worker.findOne({ phone });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const now = new Date();
    const shiftStart = worker.shiftStartTime ? new Date(worker.shiftStartTime) : now;
    const shiftDuration = (now - shiftStart) / (1000 * 60 * 60); // Convert to hours
    const totalHours = worker.totalShiftHours + shiftDuration;

    // Create WorkerShift record
    await WorkerShift.create({
      workerPhone: phone,
      shiftStartTime: shiftStart,
      shiftEndTime: now,
      shiftDuration: parseFloat(shiftDuration.toFixed(2)),
      status: 'completed',
      district: worker.district,
      taluka: worker.taluka
    });

    const worker_updated = await Worker.findOneAndUpdate(
      { phone },
      { 
        shiftEndTime: now,
        totalShiftHours: totalHours,
        workStatus: 'not-in-work'
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ 
      message: "Shift ended",
      shiftEndTime: worker_updated.shiftEndTime,
      shiftDuration: shiftDuration.toFixed(2),
      totalShiftHours: worker_updated.totalShiftHours.toFixed(2),
      workStatus: worker_updated.workStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
