import axios from "axios";

const managerAPI = axios.create({
  baseURL: "https://pms-3vhoncykv-vedant2709s-projects.vercel.app/",
  withCredentials: true,
});

export const getManagerDashboard = () =>
  managerAPI.get("api/auth/manager/dashboard");

export const getAllMembers = () => managerAPI.get("api/auth/members");
