import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", authRoute);

export default app;
