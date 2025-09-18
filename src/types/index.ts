export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export interface AuthResponse {
  access_token?: string
  token?: string
  token_type?: string
  user?: User
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CalorieRequest {
  dish_name: string
  servings: number
}

export interface CalorieResponse {
  dish_name: string
  servings: number
  calories_per_serving: number
  total_calories: number
  source: string
}

export interface ApiError {
  message: string
  status: number
}
