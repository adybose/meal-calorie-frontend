import type { AuthResponse, LoginRequest, RegisterRequest, CalorieRequest, CalorieResponse, User } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    console.log(`[API Request] Fetching: ${url}`, { method: options.method || 'GET', body: options.body ? '[REDACTED]' : undefined, hasToken: !!this.token })
    
    if (this.token) {
      console.log(`[API Auth] Token present (first 20 chars): ${this.token.substring(0, 20)}...`)
    } else {
      console.log(`[API Auth] No token set for authenticated endpoint`)
    }
    
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
    }

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    console.log(`[API Headers] Full headers:`, Object.fromEntries(headers.entries()))

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })
      
      console.log(`[API Response] Status: ${response.status}, OK: ${response.ok}, Headers:`, response.headers)
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "An error occurred" };
        }
        console.error(`[API Error] ${response.status}:`, errorData);
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API Success] Data preview:`, data);
      return data;
    } catch (error) {
      console.error(`[API Fetch Error] Full error:`, error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    console.log('[API Register] Response keys:', Object.keys(response))
    return response
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
    console.log('[API Login] Response keys:', Object.keys(response))
    return response
  }

  async getUser(): Promise<User> {
    return this.request<User>("/auth/me")
  }

  async getCalories(data: CalorieRequest): Promise<CalorieResponse> {
    return this.request<CalorieResponse>("/get-calories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
