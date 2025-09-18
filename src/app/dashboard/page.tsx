"use client"

import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import { useMealStore } from "@/stores/meal-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MealHistory } from "@/components/meal-history"
import { Calculator, TrendingUp, Utensils, User } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  useAuthGuard()
  const { user } = useAuthStore()
  const { history } = useMealStore()

  if (!user) return null

  const totalSearches = history.length
  const totalCalories = history.reduce((sum, meal) => sum + meal.total_calories, 0)
  const avgCaloriesPerMeal = totalSearches > 0 ? Math.round(totalCalories / totalSearches) : 0

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user.first_name}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your meals and monitor your calorie intake</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <MealHistory />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-sm">Get started with calorie tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full text-sm">
                  <Link href="/calories">
                    <Calculator className="mr-2 h-4 w-4" />
                    Look up Calories
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
    </div>
  )
}
