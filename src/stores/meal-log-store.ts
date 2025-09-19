import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CalorieResponse } from "@/types"

interface MealLogHistory extends CalorieResponse {
  id: string
  timestamp: number
}

interface MealLogState {
  history: MealLogHistory[]
  addMeal: (meal: CalorieResponse) => void
  clearHistory: () => void
  getMealById: (id: string) => MealLogHistory | undefined
}

export const useMealLogStore = create<MealLogState>()(
  persist(
    (set, get) => ({
      history: [],

      addMeal: (meal: CalorieResponse) => {
        const newMeal: MealLogHistory = {
          ...meal,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }

        set((state) => ({
          history: [newMeal, ...state.history].slice(0, 50), // Keep only last 50 meals
        }))
      },

      clearHistory: () => {
        set({ history: [] })
      },

      getMealById: (id: string) => {
        return get().history.find((meal) => meal.id === id)
      },
    }),
    {
      name: "meal-log-storage",
    },
  ),
)