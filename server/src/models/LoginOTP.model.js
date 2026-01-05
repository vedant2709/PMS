import mongoose from "mongoose";

const loginOTPSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    purpose: {
      type: String,
      enum: ["LOGIN", "ENABLE_2FA"],
      required: true,
    },
  },
  { timestamps: true }
);

// Auto cleanup expired OTPs
loginOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("LoginOTP", loginOTPSchema);
