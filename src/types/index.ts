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

export interface Nutrient {
  id: number
  name: string
  value: number
  unit: string
}

export interface CalorieRequest {
  dish_name: string
  servings: number
  mode: 'servings' | 'grams'
}

export interface CalorieResponse {
  dish_name: string
  selected_food: string
  fdc_id: number
  serving_size: string
  household_serving_text: string
  total_servings: number
  total_energy: number
  per_100g_nutrients: Nutrient[]
  per_serving_nutrients: Nutrient[]
  total_nutrients: Nutrient[]
  // Frontend-specific computed fields
  mode?: 'servings' | 'grams'
  amount?: number
  computed_total_nutrients?: Nutrient[]
}

export interface ApiError {
  message: string
  status: number
}
