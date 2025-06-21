import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").max(500),
  members: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectIds
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")),
  status: Joi.string()
    .valid("Not Started", "In Progress", "Completed")
});
