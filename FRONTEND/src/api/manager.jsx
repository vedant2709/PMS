import axios from "axios";

const managerAPI = axios.create({
  baseURL: "https://pms-tisw.onrender.com/",
  withCredentials: true,
});

export const getManagerDashboard = () =>
  managerAPI.get("api/auth/manager/dashboard");

export const getAllMembers = () => managerAPI.get("api/auth/members");
