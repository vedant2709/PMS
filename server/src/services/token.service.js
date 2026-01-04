import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = () => {
  return crypto.randomUUID();
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
