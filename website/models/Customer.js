import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    phone:       { type: String },
    address:     { type: String },
    dateOfBirth: { type: Date },
    status:      { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);