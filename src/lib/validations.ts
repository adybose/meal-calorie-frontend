import { z } from "zod"

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const calorieSchema = z.object({
  dish_name: z.string().min(1, "Dish name is required").max(100, "Dish name too long"),
  servings: z.number().min(0.1, "Servings must be at least 0.1").max(50, "Maximum 50 servings"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type CalorieFormData = z.infer<typeof calorieSchema>
