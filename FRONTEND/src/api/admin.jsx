import axios from "axios";

const adminAPI = axios.create({
  baseURL: "https://pms-3vhoncykv-vedant2709s-projects.vercel.app/api/admin",
  withCredentials: true,
});

export const getAllUsers = () => adminAPI.get("/users");
export const updateUser = (id, data) => adminAPI.put(`/users/${id}`, data);
