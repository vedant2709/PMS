import axios from "axios";

const taskAPI = axios.create({
  baseURL: "https://pms-3vhoncykv-vedant2709s-projects.vercel.app/api/task",
  withCredentials: true,
});

export const getTaskById = (taskId) => taskAPI.get(`/${taskId}`);

export const updateTask = (taskId, formData) =>
  taskAPI.put(`/${taskId}`, formData);

export const getAllTasks = () => taskAPI.get(`/`);

export const deleteTask = (taskId) => taskAPI.delete(`/${taskId}`);
