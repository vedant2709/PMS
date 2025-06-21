import express from "express";
import {
  getAdminDashboard,
  getAllMembers,
  getManagerDashboard,
  getMemberDashboard,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Access Admin profile
router.get(
  "/admin/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

// Access Manager Profile
router.get(
  "/manager/dashboard",
  protect,
  authorizeRoles("manager"),
  getManagerDashboard
);

// Access Member profile
router.get(
  "/member/dashboard",
  protect,
  authorizeRoles("member"),
  getMemberDashboard
);

// Get All users (having roles as member)
router.get("/members",protect,getAllMembers)

// Fetch profile details of user (Admin/Member)
router.get("/user/profile", protect, getProfile);

// Logout user
router.post("/logout", logoutUser);

export default router;
