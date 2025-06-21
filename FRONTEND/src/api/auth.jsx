import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const login = (formData) => API.post("/login", formData);
export const register = (formData) => API.post("/register", formData);
export const logoutUser = () => API.post("/logout");

export const getAdminDashboard = () => API.get("/admin/dashboard");

export const getMemberDashboard = () => API.get("/member/dashboard");

export const getProfile = () => API.get("/user/profile");
