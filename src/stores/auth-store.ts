import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { apiClient } from "@/lib/api"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrating: boolean
  setAuth: (token: string | null, user: User | null) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrating: true,

      setAuth: (token: string | null, user: User | null) => {
        console.log('[Auth Store] setAuth called with token:', !!token ? `Present (${token.substring(0, 20)}...)` : 'Missing/Null')
        apiClient.setToken(token)
        console.log('[Auth Store] apiClient token set')
        set({
          token,
          user,
          isAuthenticated: !!token,
          isHydrating: false,
        })
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isHydrating: false,
        })
      },

      clearAuth: () => {
        apiClient.setToken(null)
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isHydrating: false,
        })
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[Auth Store] Rehydration error:', error)
        } else {
          console.log('[Auth Store] Rehydrated state:', { hasToken: !!state?.token, hasUser: !!state?.user })
          if (state?.token) {
            apiClient.setToken(state.token)
          }
        }
        setTimeout(() => useAuthStore.setState({ isHydrating: false }), 0)
      },
    },
  ),
)
