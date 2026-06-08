import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    customerName:  { type: String, required: true },
    policyNumber:  { type: String, required: true },
    policyType:    { type: String, required: true },
    amount:        { type: Number, required: true },
    paymentDate:   { type: Date,   required: true },
    paymentMethod: { type: String, required: true, enum: ["Credit Card","Debit Card","Bank Transfer","Cash"] },
    status:        { type: String, enum: ["paid","pending","failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);