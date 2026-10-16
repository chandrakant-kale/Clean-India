const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv").config();

const sampleWorkers = [
  {
    name: "Rajesh Kumar",
    phone: "9876543210",
    password: "password123",
    address: "123 Main Street",
    city: "Pune",
    state: "MH",
    district: "PUNE",
    taluka: "PUNE",
    village: "Pune",
    role: "worker",
    workStatus: "on-work",
    workScore: 85
  },
  {
    name: "Priya Singh",
    phone: "9876543211",
    password: "password123",
    address: "456 Oak Avenue",
    city: "Pune",
    state: "MH",
    district: "PUNE",
    taluka: "PUNE",
    village: "Pune",
    role: "worker",
    workStatus: "on-work",
    workScore: 92
  },
  {
    name: "Amit Patel",
    phone: "9876543212",
    password: "password123",
    address: "789 Pine Road",
    city: "Pune",
    state: "MH",
    district: "PUNE",
    taluka: "PUNE",
    village: "Pune",
    role: "worker",
    workStatus: "leave",
    workScore: 78
  },
  {
    name: "Neha Sharma",
    phone: "9876543213",
    password: "password123",
    address: "321 Elm Street",
    city: "Pune",
    state: "MH",
    district: "PUNE",
    taluka: "PUNE",
    village: "Pune",
    role: "worker",
    workStatus: "not-in-work",
    workScore: 65
  },
  {
    name: "Vikram Desai",
    phone: "9876543214",
    password: "password123",
    address: "654 Maple Drive",
    city: "Pune",
    state: "MH",
    district: "PUNE",
    taluka: "PUNE",
    village: "Pune",
    role: "worker",
    workStatus: "on-work",
    workScore: 88
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Delete existing workers
    await User.deleteMany({ role: "worker" });
    console.log("Deleted existing workers");

    // Hash passwords and create workers
    for (let worker of sampleWorkers) {
      worker.password = await bcrypt.hash(worker.password, 10);
    }

    await User.insertMany(sampleWorkers);
    console.log("Sample workers added successfully!");
    console.log(`Added ${sampleWorkers.length} workers to the database`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
