"use client"

import { useState } from "react"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import { useMealLogStore } from "@/stores/meal-log-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Utensils } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MealLogForm } from "@/components/meal-log-form"
import { MealLogHistory } from "@/components/meal-log-history"
import { CalorieLookupHistory } from "@/components/calorie-lookup-history"
import type { Nutrient } from "@/types"

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

export default function DashboardPage() {
  useAuthGuard()
  const { user } = useAuthStore()
  const { history, addMeal } = useMealLogStore()

  const [open, setOpen] = useState(false)

  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.getTime()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const tomorrowStart = tomorrow.getTime()

  const todayMeals = history.filter(
    (meal) => meal.timestamp >= todayStart && meal.timestamp < tomorrowStart
  )

  const totalMealsToday = todayMeals.length
  const caloriesToday = todayMeals.reduce((sum, meal) => sum + getCalories(meal.computed_total_nutrients || meal.total_nutrients), 0)
  const avgCaloriesPerMealToday = totalMealsToday > 0 ? Math.round(caloriesToday / totalMealsToday) : 0

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Today</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{totalMealsToday}</div>
              <p className="text-xs text-muted-foreground">meals logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{caloriesToday.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">calories consumed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Meal</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{avgCaloriesPerMealToday}</div>
              <p className="text-xs text-muted-foreground">calories per meal</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user.first_name}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your meals and monitor your calorie intake</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log a Meal</CardTitle>
              <CardDescription className="text-sm">Open the form to log your meal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setOpen(true)} className="w-full text-sm">
                <Utensils className="mr-2 h-4 w-4" />
                Log a Meal
              </Button>
            </CardContent>
          </Card>

          <MealLogHistory />
          {/* <CalorieLookupHistory /> */}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <MealLogForm onResult={(result) => {
              addMeal(result)
              setOpen(false)
            }} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
