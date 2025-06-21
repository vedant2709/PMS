import User from "../models/User.model.js";
import ApiError from "../utils/apiError.js";

// Get all users (except admin himself maybe)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Update user (by ID)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) throw ApiError.notFound("User not found");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw ApiError.notFound("User not found");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
