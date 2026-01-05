import { Router } from "express";
import {
  getCurrentUser,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  verifyEmailController,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.get("/me", protect, getCurrentUser);

export default router;
