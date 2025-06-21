import axios from "axios";

const projectAPI = axios.create({
  baseURL: "https://pms-tisw.onrender.com/api/projects",
  withCredentials: true,
});

export const createProject = (formData) => projectAPI.post("/", formData);

export const getAllProjects = () => projectAPI.get("/");

export const getProjectById = (id) => projectAPI.get(`/${id}`);

export const updateProjectById = (id, updatedData) =>
  projectAPI.put(`/${id}`, updatedData);

export const deleteProject = (id) => projectAPI.delete(`/${id}`);

export const createTask = (id, formData) =>
  projectAPI.post(`/${id}/tasks`, formData);

export const getTasks = (projectId) => projectAPI.get(`/${projectId}/tasks`);
