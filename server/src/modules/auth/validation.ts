import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(80, "Last name is too long"),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required").max(128, "Password is too long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
