import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(ApiError.unauthorized("Not authorized, no token"));

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req.user (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    req.user = user;
    return next();
  } catch (error) {
    // Token expired, invalid, or other error
    next(
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? ApiError.unauthorized("Not authorized, token failed")
        : error
    );
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Access Denied: Unauthorized Role"));
    }
    next();
  };
};
