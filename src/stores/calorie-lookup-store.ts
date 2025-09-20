import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CalorieResponse } from "@/types"

interface CalorieLookupHistory extends CalorieResponse {
  id: string
  timestamp: number
}

interface CalorieLookupState {
  history: CalorieLookupHistory[]
  addCalorieLookup: (meal: CalorieResponse) => void
  clearHistory: () => void
  getCalorieLookupById: (id: string) => CalorieLookupHistory | undefined
}

export const useCalorieLookupStore = create<CalorieLookupState>()(
  persist(
    (set, get) => ({
      history: [],

      addCalorieLookup: (lookup: CalorieResponse) => {
        const newLookup: CalorieLookupHistory = {
          ...lookup,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }
    
        set((state) => ({
          history: [newLookup, ...state.history].slice(0, 50), // Keep only last 50 lookups
        }))
      },

      clearHistory: () => {
        set({ history: [] })
      },

      getCalorieLookupById: (id: string) => {
        return get().history.find((meal) => meal.id === id)
      },
    }),
    {
      name: "calorie-lookup-storage",
    },
  ),
)
