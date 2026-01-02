import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    emailVerified: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    role: { type: String, default: "member" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
