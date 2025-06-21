import express from "express";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "https://pms-6abtnrk2g-vedant2709s-projects.vercel.app/", // your frontend URL
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes
app.use("/api/auth", authRoutes); // for login/register/logout
app.use("/api/admin", adminRoutes); // for admin functionality
app.use("/api", taskRoutes);
app.use("/api/projects", projectRoutes);

// Global error handler
app.use(errorHandler);

export default app;
