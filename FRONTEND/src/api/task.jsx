import axios from "axios";

const taskAPI = axios.create({
  baseURL: "https://pms-frontend-6ciz.onrender.com/api/task",
  withCredentials: true,
});

export const getTaskById = (taskId) => taskAPI.get(`/${taskId}`);

export const updateTask = (taskId, formData) =>
  taskAPI.put(`/${taskId}`, formData);

export const getAllTasks = () => taskAPI.get(`/`);

export const deleteTask = (taskId) => taskAPI.delete(`/${taskId}`);
