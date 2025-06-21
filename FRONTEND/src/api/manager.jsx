import axios from "axios";

const managerAPI = axios.create({
  baseURL: "https://pms-frontend-6ciz.onrender.com/",
  withCredentials: true,
});

export const getManagerDashboard = () =>
  managerAPI.get("api/auth/manager/dashboard");

export const getAllMembers = () => managerAPI.get("api/auth/members");
