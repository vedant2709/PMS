import express from "express";
import { createProject, deleteProject, getManagerProjects, getProjectById, updateProject } from "../controllers/projectController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("manager"), createProject);
router.get("/", protect, authorizeRoles("manager"), getManagerProjects);
router.get("/:id", protect, authorizeRoles("manager"), getProjectById);
router.put("/:id", protect, authorizeRoles("manager"), updateProject);
router.delete("/:id", protect, authorizeRoles("manager"), deleteProject);

export default router;
