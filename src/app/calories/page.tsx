"use client"

import { useState } from "react"
import { CalorieLookupForm } from "@/components/calorie-lookup-form"
import { ResultCard } from "@/components/result-card"
import type { CalorieResponse, Nutrient } from "@/types"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import { useCalorieLookupStore } from "@/stores/calorie-lookup-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalorieLookupHistory } from "@/components/calorie-lookup-history"
import { Calculator, TrendingUp, Utensils } from "lucide-react"

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

export default function CaloriesPage() {
  useAuthGuard()
  const { user } = useAuthStore()
  const { history } = useCalorieLookupStore()
  const totalSearches = history.length
  const totalCalories = history.reduce((sum, lookup) => {
    const nutrients = lookup.computed_total_nutrients || lookup.total_nutrients
    return sum + getCalories(nutrients)
  }, 0)
  const avgCaloriesPerMeal = totalSearches > 0 ? Math.round(totalCalories / totalSearches) : 0

  const [result, setResult] = useState<CalorieResponse | null>(null)
  const { addCalorieLookup } = useCalorieLookupStore()

  const handleResult = (newResult: CalorieResponse) => {
    setResult(newResult)
    addCalorieLookup(newResult)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <div className="space-y-6 sm:space-y-8">
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{totalSearches}</div>
              <p className="text-xs text-muted-foreground">dishes looked up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{totalCalories.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">calories tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Meal</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{avgCaloriesPerMeal}</div>
              <p className="text-xs text-muted-foreground">calories per dish</p>
            </CardContent>
          </Card>
        </div> */}

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Calorie Lookup</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Search for any dish to get detailed calorie information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <CalorieLookupForm onResult={handleResult} />
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

        <CalorieLookupHistory />
      </div>
    </div>
  )
}
