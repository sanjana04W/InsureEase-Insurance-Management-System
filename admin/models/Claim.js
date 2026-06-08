import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email:        { type: String, required: true, lowercase: true },
    phone:        { type: String },
    policyNumber: { type: String, required: true },
    claimType:    { type: String, required: true },
    incidentDate: { type: Date,   required: true },
    description:  { type: String, required: true },
    claimAmount:  { type: Number, required: true },
    status:       { type: String, enum: ["pending","approved","rejected"], default: "pending" },
    reviewNote:   { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);