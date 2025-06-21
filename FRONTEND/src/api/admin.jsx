import axios from "axios";

const adminAPI = axios.create({
  baseURL: "https://pms-tisw.onrender.com/api/admin",
  withCredentials: true,
});

export const getAllUsers = () => adminAPI.get("/users");
export const updateUser = (id, data) => adminAPI.put(`/users/${id}`, data);
