import { Router } from "express";
import {
  registerController,
  verifyEmailController,
} from "./auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);

export default router;
