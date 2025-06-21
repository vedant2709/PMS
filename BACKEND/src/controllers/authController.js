import User from "../models/User.model.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/userValidation.js";
import { generateToken } from "../utils/generateToken.js";
import ApiError from "../utils/apiError.js";

// Register new user
export const registerUser = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = registerValidation.validate(req.body);
    if (error) throw ApiError.badRequest(error.details[0].message);

    const { name, email, password, role } = req.body;

    // Restrict multiple admins
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        throw ApiError.forbidden(
          "An admin already exists. Cannot create another admin."
        );
      }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) throw ApiError.badRequest("User already exists");

    // Create User
    const user = new User({ name, email, password, role });
    await user.save();

    // Respond with token and user info (except password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = loginValidation.validate(req.body);
    if (error) throw ApiError.badRequest(error.details[0].message);

    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

    // Generate JWT token
    const token = generateToken(user);

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Admin profile
export const getAdminDashboard = async (req, res, next) => {
  try {
    if (!req.user) throw ApiError.unauthorized("Not authorized");

    console.log("Inside admin dashboard");

    res.json({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Member profile
export const getMemberDashboard = async (req, res, next) => {
  try {
    if (!req.user) throw ApiError.unauthorized("Not authorized");

    res.json({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Member profile
export const getManagerDashboard = async (req, res, next) => {
  try {
    if (!req.user) throw ApiError.unauthorized("Not authorized");

    res.json({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Get common profile
export const getProfile = (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    res.status(200).json({ _id, name, email, role });
  } catch (err) {
    next(ApiError.internal("Failed to fetch profile"));
  }
};

// Get All Members
export const getAllMembers = async (req, res, next) => {
  try {
    const members = await User.find({ role: "member" });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict", // or 'Lax'
  });

  res.status(200).json({ message: "Logged out successfully" });
};
