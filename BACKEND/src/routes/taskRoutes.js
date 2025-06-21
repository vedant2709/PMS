import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTasksByProject,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Nesting under project
router.post(
  "/projects/:projectId/tasks",
  protect,
  authorizeRoles("manager"),
  createTask
);

router.get(
  "/projects/:projectId/tasks",
  protect,
  authorizeRoles("member", "manager"),
  getTasksByProject
);

router.get(
  "/task/:taskId",
  protect,
  authorizeRoles("member", "manager"),
  getTaskById
);

router.get("/task", protect, authorizeRoles("member", "manager"), getAllTasks);

// Task-level operations
router.put("/task/:taskId", protect, authorizeRoles("manager"), updateTask);

router.delete("/task/:taskId", protect, authorizeRoles("manager"), deleteTask);

export default router;
