import { Router } from "express";
import {
  disable2FAController,
  enable2FA,
  getCurrentUser,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  verifyEmailController,
  verifyEnable2FAController,
  verifyOtp,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/verify-otp", verifyOtp);
router.post("/2fa/enable", protect, enable2FA);
router.post("/2fa/verify-enable", protect, verifyEnable2FAController);
router.post("/2fa/disable", protect, disable2FAController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.get("/me", protect, getCurrentUser);

export default router;
