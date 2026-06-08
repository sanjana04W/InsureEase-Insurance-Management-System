import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/insurance_db";

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const email = "admin@insureease.com";
    
    // Check if exists
    let admin = await AdminUser.findOne({ email });
    if (admin) {
      console.log("Admin already exists. Updating password...");
      admin.password = "admin123";
      await admin.save();
      console.log("Admin password updated.");
    } else {
      console.log("Admin doesn't exist. Creating...");
      admin = new AdminUser({
        name: "Admin User",
        email: email,
        password: "admin123"
      });
      await admin.save();
      console.log("Admin user created.");
    }
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
