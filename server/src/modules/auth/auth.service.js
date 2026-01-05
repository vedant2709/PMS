import bcrypt from "bcrypt";
import crypto from "crypto";
import PendingUserModel from "../../models/PendingUser.model.js";
import EmailVerificationTokenModel from "../../models/EmailVerificationToken.model.js";
import User from "../../models/User.model.js";
import { sendEmail } from "../../services/email.service.js";
import { verifyEmailTemplate } from "../../templates/email/verifyEmail.template.js";
import { AppError } from "../../utils/AppError.js";
import UserModel from "../../models/User.model.js";
import {
  generateRefreshToken,
  hashToken,
  signAccessToken,
} from "../../services/token.service.js";
import RefreshTokenModel from "../../models/RefreshToken.model.js";
import LoginOTPModel from "../../models/LoginOTP.model.js";
import { generateOTP, hashOTP } from "../../services/otp.service.js";

export const registerUser = async (name, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const pendingUser = await PendingUserModel.create({
    name,
    email,
    passwordHash,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const rawToken = crypto.randomUUID();
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await EmailVerificationTokenModel.create({
    pendingUserId: pendingUser._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const verifyUrl = `${process.env.CLIENT_URL}/api/v1/verify-email?token=${rawToken}`;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html: verifyEmailTemplate(name, verifyUrl),
  });

  return rawToken;
};

export const verifyEmail = async (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const tokenDoc = await EmailVerificationTokenModel.findOne({
    tokenHash,
    used: false,
  });

  if (!tokenDoc) throw new AppError("Invalid or expired token", 400);

  const pendingUser = await PendingUserModel.findById(tokenDoc.pendingUserId);

  if (!pendingUser) throw new AppError("Signup expired", 400);

  await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    passwordHash: pendingUser.passwordHash,
    emailVerified: true,
  });

  tokenDoc.used = true;
  await tokenDoc.save();
  await pendingUser.deleteOne();
};

export const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // 🔐 2FA LOGIN FLOW
  if (user.twoFactorEnabled) {
    // ✅ Remove only LOGIN OTPs
    await LoginOTPModel.deleteMany({
      userId: user._id,
      purpose: "LOGIN",
    });

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    await LoginOTPModel.create({
      userId: user._id,
      otpHash,
      purpose: "LOGIN",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: "Your login verification OTP",
      html: `
        <p>Your OTP code is:</p>
        <h2>${otp}</h2>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    return {
      otpRequired: true,
      userId: user._id.toString(),
    };
  }

  // 🔓 NON-2FA LOGIN FLOW

  const accessToken = signAccessToken({
    userId: user._id.toString(),
  });

  // 🔒 Enforce single session
  await RefreshTokenModel.updateMany(
    { userId: user._id, revoked: false },
    { revoked: true }
  );

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

export const verifyLoginOTP = async (userId, otp) => {
  const otpDoc = await LoginOTPModel.findOne({ userId });

  if (!otpDoc) {
    throw new AppError("OTP expired or invalid", 400);
  }

  if (otpDoc.expiresAt < new Date()) {
    await otpDoc.deleteOne();
    throw new AppError("OTP expired", 400);
  }

  if (otpDoc.attempts >= 5) {
    await otpDoc.deleteOne();
    throw new AppError("Too many invalid attempts", 429);
  }

  const otpHash = hashOTP(otp);

  if (otpHash !== otpDoc.otpHash) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new AppError("Invalid OTP", 400);
  }

  // ✅ OTP valid
  await otpDoc.deleteOne();

  // 🔒 Single-session enforcement
  await RefreshTokenModel.updateMany(
    { userId, revoked: false },
    { revoked: true }
  );

  const accessToken = signAccessToken({ userId });
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const requestEnable2FA = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  if (!user.emailVerified) {
    throw new AppError("Verify email before enabling 2FA", 400);
  }

  if (user.twoFactorEnabled) {
    throw new AppError("2FA already enabled", 400);
  }

  // Remove old otps
  await LoginOTPModel.deleteMany({
    userId,
    purpose: "ENABLE_2FA",
  });

  const otp = generateOTP();
  const otpHash = hashOTP(otp);

  await LoginOTPModel.create({
    userId,
    otpHash,
    purpose: "ENABLE_2FA",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail({
    to: user.email,
    subject: "Confirm enabling 2FA",
    html: `
      <p>Use this OTP to enable 2FA:</p>
      <h2>${otp}</h2>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};

export const verifyEnable2FA = async (userId, otp) => {
  const otpDoc = await LoginOTPModel.findOne({
    userId,
    purpose: "ENABLE_2FA",
  });

  if (!otpDoc) {
    throw new AppError("OTP expired or invalid", 400);
  }

  if (otpDoc.expiresAt < new Date()) {
    await otpDoc.deleteOne();
    throw new AppError("OTP expired", 400);
  }

  const otpHash = hashOTP(otp);

  if (otpHash !== otpDoc.otpHash) {
    throw new AppError("Invalid OTP", 400);
  }

  await UserModel.findByIdAndUpdate(userId, { twoFactorEnabled: true });

  await otpDoc.deleteOne();
};

export const disable2FA = async (userId, password) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new AppError("Invalid password", 401);
  }

  await UserModel.findByIdAndUpdate(userId, {
    twoFactorEnabled: false,
  });

  // 🔒 Revoke all sessions
  await RefreshTokenModel.updateMany(
    { userId, revoked: false },
    { revoked: true }
  );
};

export const refreshAccessToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  const tokenDoc = await RefreshTokenModel.findOne({
    tokenHash,
    revoked: false,
  });

  if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = signAccessToken({ userId: tokenDoc.userId.toString() });

  return accessToken;
};

export const rotateRefreshToken = async (oldRefreshToken) => {
  const oldTokenHash = hashToken(oldRefreshToken);

  const existingToken = await RefreshTokenModel.findOne({
    tokenHash: oldTokenHash,
    revoked: false,
  });

  // ❌ Token reuse or theft detected
  if (!existingToken) {
    throw new AppError("Invalid or reused refresh token", 401);
  }

  if (existingToken.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  // 🔒 Revoke old token
  existingToken.revoked = true;
  await existingToken.save();

  // 🔁 Create new refresh token
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashToken(newRefreshToken);

  await RefreshTokenModel.create({
    userId: existingToken.userId,
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // 🔑 New access token
  const accessToken = signAccessToken({
    userId: existingToken.userId.toString(),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.updateOne(
    {
      tokenHash,
    },
    { revoked: true }
  );
};
