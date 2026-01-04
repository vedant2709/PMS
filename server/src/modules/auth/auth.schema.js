import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});
