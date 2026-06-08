import mongoose from "mongoose";

const PolicySchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    description:    { type: String, required: true },
    category:       { type: String, required: true, enum: ["Health","Auto","Home","Travel","Life"] },
    coverageAmount: { type: Number, required: true },
    premium:        { type: Number, required: true },
    duration:       { type: Number, required: true }, // months
    benefits:       [{ type: String }],
    status:         { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Policy || mongoose.model("Policy", PolicySchema);