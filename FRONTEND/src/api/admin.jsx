import axios from "axios";

const adminAPI = axios.create({
  baseURL: "https://pms-frontend-6ciz.onrender.com/api/admin",
  withCredentials: true,
});

export const getAllUsers = () => adminAPI.get("/users");
export const updateUser = (id, data) => adminAPI.put(`/users/${id}`, data);
