import Project from "../models/Project.model.js";
import ApiError from "../utils/apiError.js";
import { createProjectSchema } from "../validations/projectValidation.js";

// Create Project
export const createProject = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = createProjectSchema.validate(req.body);
    if (error) throw ApiError.badRequest(error.details[0].message);

    console.log(req.body);
    const { name, description, members, startDate, endDate, status } = req.body;

    // Check if project already exists
    const alreadyExists = await Project.findOne({ name: name });
    if (alreadyExists) throw ApiError.forbidden("Project Already exists");

    const project = await Project.create({
      name,
      description,
      members,
      startDate,
      endDate,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// Get all projects created by the manager
export const getManagerProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).populate(
      "members",
      "name email"
    );
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// Get project by ID
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email"
    );

    if (!project) return next(ApiError.notFound("Project not found"));
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// Update Project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return next(ApiError.notFound("Project not found"));
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return next(ApiError.notFound("Project not found"));
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};
