import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CalorieResponse } from "@/types"

interface MealHistory extends CalorieResponse {
  id: string
  timestamp: number
}

interface MealState {
  history: MealHistory[]
  addMeal: (meal: CalorieResponse) => void
  clearHistory: () => void
  getMealById: (id: string) => MealHistory | undefined
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      history: [],

      addMeal: (meal: CalorieResponse) => {
        const newMeal: MealHistory = {
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
      name: "meal-storage",
    },
  ),
)
