import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
  verifyEmailController,
} from "./auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;
