import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, _req, res, _next) => {
  // ✅ Zod validation errors
  if (err instanceof ZodError) {
    const flattened = err.flatten();

    return res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors: flattened.fieldErrors, // 👈 THIS IS THE KEY
    });
  }

  // Known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  // Unknown / programming errors
  console.error("🔥 UNEXPECTED ERROR:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
