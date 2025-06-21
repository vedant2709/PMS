import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
