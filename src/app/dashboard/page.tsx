"use client"

import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import { useMealStore } from "@/stores/meal-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Utensils, User } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  useAuthGuard()
  const { user } = useAuthStore()
  const { history } = useMealStore()

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
  const caloriesToday = todayMeals.reduce((sum, meal) => sum + meal.total_calories, 0)
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
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-sm">Get started with meal logging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full text-sm">
                <Link href="/calories">
                  <Utensils className="mr-2 h-4 w-4" />
                  Log a Meal
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground break-all">{user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
