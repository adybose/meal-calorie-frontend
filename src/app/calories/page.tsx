"use client"

import { useState } from "react"
import { MealForm } from "@/components/meal-form"
import { ResultCard } from "@/components/result-card"
import type { CalorieResponse } from "@/types"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useMealStore } from "@/stores/meal-store"

export default function CaloriesPage() {
  useAuthGuard()
  const [result, setResult] = useState<CalorieResponse | null>(null)
  const { addMeal } = useMealStore()

  const handleResult = (newResult: CalorieResponse) => {
    setResult(newResult)
    addMeal(newResult)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Calorie Lookup</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Search for any dish to get detailed calorie information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <MealForm onResult={handleResult} />
          </div>

          <div>
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center space-y-2 p-4">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Enter a dish name to see calorie information here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
