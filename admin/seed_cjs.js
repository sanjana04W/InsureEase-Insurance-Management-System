const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://127.0.0.1:27017/insurance_db";

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

AdminUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB.");

    const email = "admin@insureease.com";
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
