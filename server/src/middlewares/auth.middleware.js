import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import UserModel from "../models/User.model.js";

export const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // 2️⃣ Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await UserModel.findById(decoded.userId).select("_id role");

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // 3️⃣ Attach user to request
    req.user = {
      id: decoded.userId,
      role: "member", // default, overridden later
    };

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
