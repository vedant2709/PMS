import { loginSchema, registerSchema } from "./auth.schema.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken,
  verifyEmail,
} from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import UserModel from "../../models/User.model.js";

export const registerController = catchAsync(async (req, res) => {
  const body = registerSchema.parse(req.body);

  await registerUser(body.name, body.email, body.password);

  res.status(201).json({
    message: "Verification email sent",
  });
});

export const verifyEmailController = catchAsync(async (req, res) => {
  await verifyEmail(req.query.token);
  res.json({ message: "Email verified successfully" });
});

export const loginController = catchAsync(async (req, res) => {
  console.log("Inside login controller");
  const body = loginSchema.parse(req.body);

  const result = await loginUser(body.email, body.password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const refreshTokenController = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  if (!oldRefreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const { accessToken, refreshToken } = await rotateRefreshToken(
    oldRefreshToken
  );

  // 🍪 Set new refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: "success",
    accessToken,
  });
});

export const logoutController = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  // 🍪 Clear cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({
    status: "success",
    userDetails: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
