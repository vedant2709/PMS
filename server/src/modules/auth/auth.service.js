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

  // Access token
  const accessToken = signAccessToken({ userId: user._id.toString() });

  // 🔒 Invalidate all previous sessions
  await RefreshTokenModel.updateMany(
    {
      userId: user._id,
      revoked: false,
    },
    { revoked: true }
  );

  // Refresh token
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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
