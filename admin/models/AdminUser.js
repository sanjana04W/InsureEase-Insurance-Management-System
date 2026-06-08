import mongoose from "mongoose";
import bcrypt   from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, default: "admin" },
  },
  { timestamps: true }
);

AdminUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

AdminUserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);