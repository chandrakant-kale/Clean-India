const express = require("express");
const mongoose = require("mongoose");
const authroute = require('./routes/authRoutes');
const authcontact = require('./routes/contactRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const couponRoutes = require('./routes/couponRoutes');
const cors = require("cors");
require("dotenv").config();

const PORT = 5000;

const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175"], // Support both Vite ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authroute);
app.use('/api/contact', authcontact);
app.use("/api/waste", wasteRoutes);
app.use("/api/coupons", couponRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
