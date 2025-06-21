import axios from "axios";

const adminAPI = axios.create({
  baseURL: "http://localhost:3000/api/admin",
  withCredentials: true,
});

export const getAllUsers = () => adminAPI.get("/users");
export const updateUser = (id, data) => adminAPI.put(`/users/${id}`, data);
