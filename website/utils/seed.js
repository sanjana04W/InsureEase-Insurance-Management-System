// Run with: node utils/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const PolicySchema = new mongoose.Schema(
  { title: String, description: String, category: String,
    coverageAmount: Number, premium: Number, duration: Number, status: String },
  { timestamps: true }
);

const AdminUserSchema = new mongoose.Schema(
  { name: String, email: String, password: String, role: String },
  { timestamps: true }
);

import bcrypt from "bcryptjs";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const Policy    = mongoose.model("Policy", PolicySchema);
  const AdminUser = mongoose.model("AdminUser", AdminUserSchema);

  // Clear existing
  await Policy.deleteMany({});
  await AdminUser.deleteMany({});

  // Seed policies
  await Policy.insertMany([
    { title: "Basic Health Plan",       category: "Health",  description: "Essential medical coverage for individuals including outpatient and hospitalization.",    coverageAmount: 50000,   premium: 49,  duration: 12, status: "active" },
    { title: "Premium Health Plan",     category: "Health",  description: "Comprehensive health coverage including dental, vision, and specialist consultations.",  coverageAmount: 200000,  premium: 129, duration: 12, status: "active" },
    { title: "Auto Shield Basic",       category: "Auto",    description: "Covers third-party liability, fire, and theft for your vehicle.",                        coverageAmount: 30000,   premium: 29,  duration: 12, status: "active" },
    { title: "Auto Shield Comprehensive", category: "Auto",  description: "Full vehicle protection including collision, theft, and roadside assistance.",           coverageAmount: 100000,  premium: 69,  duration: 12, status: "active" },
    { title: "Home Protect Basic",      category: "Home",    description: "Covers structural damage from fire, flooding, and natural disasters.",                   coverageAmount: 250000,  premium: 39,  duration: 12, status: "active" },
    { title: "Home Protect Premium",    category: "Home",    description: "Full home and contents coverage including theft, damage, and public liability.",         coverageAmount: 1000000, premium: 89,  duration: 12, status: "active" },
    { title: "Travel Safe Basic",       category: "Travel",  description: "Single trip coverage for medical emergencies, cancellations, and lost baggage.",        coverageAmount: 50000,   premium: 15,  duration: 1,  status: "active" },
    { title: "Travel Safe Annual",      category: "Travel",  description: "Annual multi-trip coverage for frequent travelers worldwide.",                           coverageAmount: 150000,  premium: 99,  duration: 12, status: "active" },
    { title: "Life Assurance Basic",    category: "Life",    description: "Term life insurance providing financial security for your family.",                      coverageAmount: 500000,  premium: 59,  duration: 120, status: "active" },
    { title: "Life Assurance Premium",  category: "Life",    description: "Whole-of-life coverage with investment component and critical illness rider.",           coverageAmount: 1000000, premium: 199, duration: 240, status: "active" },
  ]);
  console.log("✅ Policies seeded");

  // Seed admin user
  const hashedPwd = await bcrypt.hash("admin123", 12);
  await AdminUser.create({
    name: "Super Admin", email: "admin@insureease.com",
    password: hashedPwd, role: "admin",
  });
  console.log("✅ Admin user created — email: admin@insureease.com / password: admin123");

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(console.error);