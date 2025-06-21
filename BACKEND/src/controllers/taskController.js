import Project from "../models/Project.model.js";
import Task from "../models/Task.model.js";
import ApiError from "../utils/apiError.js";

// Manager creates a task
export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, startDate, endDate, assignedTo, status } =
      req.body;

    const project = await Project.findById(projectId);
    if (!project) return next(ApiError.notFound("Project not found"));

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        ApiError.forbidden(
          "You are not allowed to create tasks in this project"
        )
      );
    }

    if (!project.members.includes(assignedTo)) {
      return next(
        ApiError.badRequest("Assigned user is not a member of this project")
      );
    }

    const task = await Task.create({
      title,
      description,
      startDate,
      endDate,
      assignedTo,
      status,
      assignedBy: req.user._id,
      project: projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Get all tasks of a project
export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return next(ApiError.notFound("Project not found"));

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({})
      .populate("project", "name")
      .populate("assignedTo", "name email");
    if (!tasks) return next(ApiError.notFound("Tasks not found"));

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return next(ApiError.notFound("Task not found"));

    const tasks = await Task.find({ _id: taskId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Update Task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    }).populate("assignedTo assignedBy", "name email");

    if (!task) return next(ApiError.notFound("Task not found"));

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete Task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return next(ApiError.notFound("Task not found"));

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
