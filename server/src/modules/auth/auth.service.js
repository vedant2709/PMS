import bcrypt from "bcrypt";
import crypto from "crypto";
import PendingUserModel from "../../models/PendingUser.model.js";
import EmailVerificationTokenModel from "../../models/EmailVerificationToken.model.js";
import User from "../../models/User.model.js";
import { sendEmail } from "../../services/email.service.js";
import { verifyEmailTemplate } from "../../templates/email/verifyEmail.template.js";

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

  if (!tokenDoc) throw new Error("Invalid or expired token");

  const pendingUser = await PendingUserModel.findById(tokenDoc.pendingUserId);

  if (!pendingUser) throw new Error("Signup expired");

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
